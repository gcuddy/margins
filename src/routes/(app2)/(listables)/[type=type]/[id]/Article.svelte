<script lang="ts">
	import {
		useEscapeKeydown,
		usePortal,
	} from '@melt-ui/svelte/internal/actions';
	import { draggable } from '@neodrag/svelte';
	import * as Dialog from '$components/ui/dialog';
	import { createMutation, useQueryClient } from '@tanstack/svelte-query';
	import debounce from 'just-debounce-it';
	import throttle from 'just-throttle';
	import { finder } from '@medv/finder';
	import DOMPurify from 'dompurify';

	import {
		EditIcon,
		EraserIcon,
		ExternalLink,
		Highlighter,
	} from 'lucide-svelte';
	import { afterUpdate, getContext, onDestroy, onMount, tick } from 'svelte';
	import { derived, type Writable, writable } from 'svelte/store';
	import { scale } from 'svelte/transition';
	import { createPopperActions } from 'svelte-popperjs';
	import { toast } from 'svelte-sonner';

	import EditAnnotationInline from '$components/annotations/edit-annotation-inline.svelte';

	import { browser } from '$app/environment';
	import { enhance } from '$app/forms';
	import { afterNavigate, beforeNavigate, goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Editor from '$components/ui/editor/Editor.svelte';
	import Kbd from '$components/ui/KBD.svelte';
	import * as Tooltip from '$components/ui/tooltip';
	import drag_context from '$lib/actions/drag-context';
	import focusTrap from '$lib/actions/focus-trap';
	import type { TargetSchema } from '$lib/annotation';
	import {
		createCssSelectorMatcher,
		createTextPositionSelectorMatcher,
		createTextQuoteSelectorMatcher,
		describeSelection,
		describeTextPosition,
		describeTextQuote,
	} from '$lib/annotator';
	import {
		highlightText,
		isTextNode,
		removeHighlight,
	} from '$lib/annotator/highlighter';
	import type {
		CssSelector,
		RangeSelector,
		TextPositionSelector,
		TextQuoteSelector,
	} from '$lib/annotator/types';
	import { Button } from '$lib/components/ui/button';
	import { Lead, Muted } from '$lib/components/ui/typography';
	import {
		coalesceObjects,
		getHTMLOfSelection,
		isAnnotation,
		isHTMLElement,
		makeAnnotation,
		makeInteraction,
	} from '$lib/helpers';
	import { nanoid } from '$lib/nanoid';
	import { invalidateEntries } from '$lib/queries/mutations';
	import {
		mutation,
		type MutationInput,
		type QueryOutput,
	} from '$lib/queries/query';
	import type { FullEntryDetail } from '$lib/queries/server';
	import { createAnnotationStore } from '$lib/stores/annotations';
	import mq from '$lib/stores/mq';
	import type { Type } from '$lib/types';
	import { flyAndScale, getHostname } from '$lib/utils';
	import { getTargetSelector } from '$lib/utils/annotations';
	import { numberOrString } from '$lib/utils/misc';
	import { cn } from '$lib/utils/tailwind';

	import type { MenuBar } from '../../../MainNav.svelte';
	import {
		getAppearanceContext,
		getArticleContext,
		getEntryContext,
	} from '../ctx';
	import type { PageData } from './$types';
	import Attachments from './Attachments.svelte';
	import type { RequireAtLeastOne } from 'type-fest';
	import { currentEntryList } from '$components/entries/store';
	import { make_link } from '$lib/utils/entries';
	import Selection from './Selection.svelte';
	import type { entryDetailsQuery } from './query';
	import type { JSONContent } from '@tiptap/core';
	import { startingContentData } from '$components/ui/editor/constants';
	import { isBlankJsonContent } from '$components/ui/editor/utils';
	import { ownerDocument } from '$lib/annotator/utils';
	import { makeCreateRangeSelectorMatcher } from '$lib/annotator/range';
	import { makeRefinable } from '$lib/annotator/refinable';

	const {
		activeAnnotation,
		activeAnnotationId,
		annotations,
		showEditAnnotation,
	} = createAnnotationStore();

	export let data: PageData;
	export let query: ReturnType<typeof entryDetailsQuery>;

	const activeAnnotationFromQuery = derived(
		[query, activeAnnotationId],
		([$query, $activeAnnotationId]) => {
			if (!$query.data?.entry?.annotations) {
				return null;
			}
			const annotation = $query.data.entry.annotations.find(
				(a) => a.id === $activeAnnotationId,
			);
			if (!annotation) {
				return null;
			}
			return annotation;
		},
	);

	$: console.log({ $activeAnnotationId, $activeAnnotationFromQuery });

	const mainnav: Writable<MenuBar> = getContext('mainnav');

	const appearance = getAppearanceContext();

	const queryClient = useQueryClient();

	$: queryKey = [
		'entries',
		'detail',
		{
			input: {
				id: numberOrString($page.params.id ?? ''),
				type: $page.data.type as Type,
			},
		},
	];

	$: author = data.entry?.author;

	$: currentIndex = $currentEntryList.findIndex(
		(entry) => entry.id === data.entry?.id,
	);
	$: next = $currentEntryList[currentIndex + 1];
	$: next_link = next ? make_link(next) : null;

	type Entry = QueryOutput<'entry_by_id'>;

	function modifyEntry(
		cb: (entry: RequireAtLeastOne<Entry, 'entry'>) => Entry,
	) {
		queryClient.setQueryData<QueryOutput<'entry_by_id'>>(queryKey, (old) => {
			if (!old) {
				return old;
			}
			return cb(old);
		});
	}

	const annotateMutation = createMutation({
		mutationFn: async (input: MutationInput<'save_note'>) => {
			if (!data.entry) {
				return;
			}
			return mutation($page, 'save_note', {
				entryId: data.entry.id,
				...input,
			});
		},
		onError: (err, newTodo, context) => {
			toast.error('Failed to save annotation');
			if (context) {
				// @ts-expect-error - TODO: why is ts complaining about this?
				queryClient.setQueryData(queryKey, context.previousEntryData);
			}
		},
		async onMutate(newData) {
			await queryClient.cancelQueries({
				queryKey: ['entries'],
			});

			// Snapshot the previous value
			const previousEntryData =
				queryClient.getQueryData<QueryOutput<'entry_by_id'>>(queryKey);

			// // Optimistically update to the new value
			queryClient.setQueryData<QueryOutput<'entry_by_id'>>(queryKey, (old) => {
				if (!old) {
					return old;
				}
				if (!old.entry) {
					return old;
				}

				const ids = Array.isArray(newData.id) ? newData.id : [newData.id];

				const newAnnotations = ids.map((id) => {
					const { tags, ...rest } = newData;
					// TODO: tags
					return makeAnnotation({
						// @ts-expect-error TODO: why is ts complaining about this?
						id: id!,
						...rest,
					});
				});

				const oldIds = old.entry.annotations?.map((a) => a.id) ?? [];
				const annotationsToAdd = newAnnotations.filter(
					(a) => !oldIds.includes(a.id),
				);

				const updatedAnnotations = (old.entry.annotations ?? [])
					.map((annotation) => {
						if (ids.includes(annotation.id)) {
							return {
								...annotation,
								...newAnnotations.find((a) => a.id === annotation.id),
							};
						}
						return annotation;
					})
					.concat(annotationsToAdd);

				return {
					...old,
					entry: {
						...old.entry,
						annotations: [...updatedAnnotations],
					},
				};
			});

			if ($rightSidebar) {
				await tick();
				const sidebarEl = document.getElementById('entry-sidebar');
				if (sidebarEl) {
					const annotationEl = sidebarEl.querySelector(
						`[data-sidebar-annotation-id="${newData.id}"]`,
					);
					if (annotationEl) {
						annotationEl.scrollIntoView();
					}
				}
				// scroll to new annotation
			}

			// // Return a context object with the snapshotted value
			return { previousEntryData };
		},
		onSettled(data, error, variables, context) {
			void invalidateEntries(queryClient);
		},
	});

	const selection = writable<Selection | null>(null);

	const showAnnotationTooltip = derived(selection, ($selection) => {
		if (!$selection?.rangeCount || $selection.isCollapsed) {
			return false;
		}
		const range = $selection.getRangeAt(0);
		const parent = range.commonAncestorContainer.parentElement;
		if (!parent) {
			return false;
		}
		if (!parent.closest('#article')) {
			return false;
		}
		if (
			range.startContainer.parentElement?.closest('[data-annotation-id]') ??
			range.endContainer.parentElement?.closest('[data-annotation-id]')
		) {
			return false;
		}
		const text = range.toString();
		return text.length > 0;
	});

	const virtualEl = derived(selection, ($selection) => {
		if (!$selection?.rangeCount || $selection.isCollapsed) {
			return {
				getBoundingClientRect: () =>
					({
						bottom: 0,
						height: 0,
						left: 0,
						right: 0,
						top: 0,
						width: 0,
					}) as DOMRect,
			};
		}
		const range = $selection.getRangeAt(0);
		return {
			getBoundingClientRect: () => range.getBoundingClientRect(),
		};
	});

	const setSelectionFn = () => {
		selection.set(window.getSelection());
	};
	function handleSelect(e: Event) {
		if (data.type !== 'article') {
			return;
		}
		requestAnimationFrame(setSelectionFn);
	}

	const [popperRef, popperContent] = createPopperActions({
		modifiers: [
			{
				name: 'offset',
				options: {
					offset: [0, 12],
				},
			},
			{
				name: 'flip',
				options: {
					fallbackPlacements: ['top', 'bottom', 'left', 'right'],
					padding: {
						bottom: 0,
						top: 64,
					},
				},
			},
		],
		placement: $mq.desktop ? 'top' : 'bottom',
		strategy: 'absolute',
	});

	const [annotationRef, annotationContent] = createPopperActions({
		modifiers: [
			{
				name: 'offset',
				options: {
					offset: [0, 12],
				},
			},
		],
		placement: 'bottom',
		// // placement: 'right',
		// strategy: 'fixed',
	});

	let articleWrapper: HTMLElement | undefined = undefined;

	function findStartOfRange(range: Range) {
		let startNode = range.startContainer;
		if (isTextNode(startNode) && range.startOffset === startNode.length) {
			startNode =
				startNode.nextSibling ?? startNode.parentNode?.nextSibling ?? startNode;
		}
		return startNode;
	}

	function findEndOfRange(range: Range) {
		let endNode = range.endContainer;
		if (isTextNode(endNode) && range.endOffset === 0) {
			endNode =
				endNode.previousSibling ??
				endNode.parentNode?.previousSibling ??
				endNode;
		}
		return endNode;
	}

	function isNodeImage(node: Node): boolean {
		const text = node.textContent?.trim() ?? '';
		return isHTMLElement(node)
			? !text && (node.querySelector('img') || node.matches('img'))
			: false;
	}

	function createFragment(
		startingEl: HTMLElement,
		endingEl: HTMLElement,
	): HTMLElement | null {
		if (!startingEl || !endingEl) return null;

		const fragment = document.createElement('div');
		let currentEl = startingEl;

		while (currentEl && currentEl !== endingEl.nextSibling) {
			fragment.appendChild(currentEl.cloneNode(true));
			currentEl = currentEl.nextSibling as HTMLElement;
		}

		return fragment;
	}

	async function makeRangeSelector(
		range: Range,
	): Promise<RangeSelector | null> {
		// check if start container contains no text, in which case it's probably an image. use a css selector, and go to end to make range. if end has no text, use css selector again. otherwise use text quote.
		console.log('makerangeselector', range);
		const startContainer = range.startContainer;
		const endContainer = range.endContainer;
		let startNode = findStartOfRange(range);

		console.log({
			startNode,
			endContainer,
		});

		if (!isHTMLElement(startNode) && !isHTMLElement(endContainer)) {
			console.log(
				'Not making range selector because start and end are not HTMLElements',
			);
			return null;
		}

		let startSelector: CssSelector | undefined = undefined;
		let endSelector: CssSelector | undefined = undefined;

		const startText = startNode.textContent?.trim() ?? '';
		const endText = endContainer.textContent?.trim() ?? '';

		let startingEl = startNode;
		while (startingEl.parentElement !== range.commonAncestorContainer) {
			startingEl = startingEl.parentElement!;
		}
		let endingEl = range.endContainer;
		while (endingEl.parentElement !== range.commonAncestorContainer) {
			endingEl = endingEl.parentElement!;
		}
		console.log({ startingEl, endingEl });
		const fragment = createFragment(startingEl, endingEl);
		console.log({ fragment });

		// make temporary container to hold all elements in range
		// const fragment = ownerDocument(range).createDocumentFragment();
		// let el = startingEl;
		// while (el !== endingEl) {
		//     console.log({ el })
		//     fragment.appendChild(el);
		//     el = el.nextElementSibling!;
		// }

		// console.log({fragment})

		// // get all elements in between, and then put them all into a temporary fragment div
		// // const fragment = ownerDocument(range).createDocumentFragment();
		// // let el = startingEl;
		// // while (el !== endingEl) {
		// // 	fragment.appendChild(el);
		// // 	el = el.nextElementSibling!;
		// // }
		// // fragment.appendChild(el);

		// console.log({ fragment });
		// check if start has no text and contains (or is) an image
		if (
			isHTMLElement(startNode) &&
			!startText &&
			(startNode.querySelector('img') || startNode.matches('img'))
		) {
			console.log('Start container contains an image');
			const selector = finder(startNode);
			startSelector = {
				type: 'CssSelector',
				value: selector,
			};
			console.log({ startSelector });
		} else {
			// find parent element
			const parentElement = startNode.parentElement!.nextElementSibling!;
			startSelector = {
				type: 'CssSelector',
				value: finder(parentElement),
				refinedBy: {
					type: 'TextPositionSelector',
					start: range.startOffset,
					end: range.endOffset,
				},
			};
		}

		// check if end has no text and contains (or is) an image
		if (
			isHTMLElement(endContainer) &&
			!endText &&
			(endContainer.querySelector('img') || endContainer.matches('img'))
		) {
			console.log('End container contains an image');
			const selector = finder(endContainer);
			endSelector = {
				type: 'CssSelector',
				value: selector,
			};
			console.log({ endSelector });
		} else {
			// Range selector incudes everything up to end container, so we need to select next node,
			// and then determine selection from there

			// TODO: more safe null checks
			let p = endContainer.parentElement!;
			console.log({ p });
			let i = 0;
			while (!p.nextElementSibling) {
				p = p.parentElement!;
				i++;
				// loop guard
				if (i > 20) {
					throw new Error('Could not find next element sibling');
				}
			}

			const el = p.nextElementSibling!;

			console.log({ p, el });

			// now get text quote *within* p;
			const textQuoteSelector = await describeTextQuote(range, p);
			console.log({ textQuoteSelector });

			const selector = finder(el);
			// Now text quote  with new parent element
			endSelector = {
				type: 'CssSelector',
				value: selector,
				// refinedBy: textQuoteSelector,
			};
			// console.log('End container does not contain an image');
			// const newRange = new Range();
			// newRange.setStart(endContainer, 0);
			// newRange.setEnd(endContainer, range.endOffset);
			// endSelector = await describeTextQuote(newRange, articleWrapper);
		}

		const newRange = new Range();
		newRange.selectNode(fragment!);

		const textPositionSelector = describeTextPosition(range, fragment);

		range.toString;
		// textPositionSelector.start = range.startOffset;
		console.log({ textPositionSelector });

		// this is probably a bad idea no? We want to get the range to "include" the image...
		return {
			type: 'RangeSelector',
			startSelector: startSelector!,
			endSelector: endSelector!,
			// refinedBy: textPositionSelector
		};

		// console.log({
		//     startText,
		//     endText
		// })

		// if (startText.length === 0) {
		//     const startSelector = finder(startContainer);
		//     console.log({ startSelector });
		// }

		// if (endText.length === 0) {
		//     const endSelector = finder(endContainer);
		//     console.log({ endSelector });
		// }
	}

	const clearSelection = () => window.getSelection()?.removeAllRanges();
	const highlight = async (
		attrs?: Record<string, string>,
	): Promise<
		| {
				els: Awaited<ReturnType<typeof highlightSelectorTarget>>;
				exact: string;
				html: string;
				id: string;
				selector: TargetSchema['selector'];
				start: number;
		  }
		| undefined
	> => {
		const range = $selection?.getRangeAt(0);
		if (!range || range.collapsed) {
			return;
		}
		if (!articleWrapper) {
			return;
		}
		const html = DOMPurify.sanitize(getHTMLOfSelection());

		// const rangeSelector = await makeRangeSelector(range);
		const textPositionSelector = describeTextPosition(range, articleWrapper);

		// Test if selection starts with image. If so, subtract 1 from start. If selection ends with image, add 1 to end.
		// This is a hacky way to get images to highlight. It's not the *most* exhaustive (and maybe we should save imageEls another way as an alternative to the limited web annotation data model), but it works for now.
		// maybe save something like image_els: and then their css selector
		// After much futzing around with range selectors and refinement, this seems to somehow be the most reliable way.
		// Since we save both the textQuote and textPosition, we could also cross-compare to make sure we're in the same place to be robust when re-hydrating.
		const startNode = findStartOfRange(range);
		const endNode = findEndOfRange(range);
		console.log({ startNode, endNode });

		const id = $activeAnnotationId ?? nanoid();
		const els = await createRangeSelector(
			{
				...textPositionSelector,
				start: isNodeImage(startNode)
					? textPositionSelector.start - 1
					: textPositionSelector.start,
				end: isNodeImage(endNode)
					? textPositionSelector.end + 1
					: textPositionSelector.end,
			},
			{
				'data-annotation-id': id,
				'data-has-body': 'false',
				id: `annotation-${id}`,
				...attrs,
			},
		);
		const textQuoteSelector = await describeTextQuote(range, articleWrapper);
		const { start } = textPositionSelector;
		const { exact } = textQuoteSelector;

		return {
			els,
			exact,
			html,
			id,
			// TODO: add in cssSelector describing image elements in more detail
			selector: [textQuoteSelector, textPositionSelector],
			start,
		};
	};

	async function highlightCssSelector(selector: CssSelector) {
		const matches = createCssSelectorMatcher(selector)(articleWrapper!);

		const matchList = [];
		for await (const match of matches) {
			matchList.push(match);
		}

		console.log({ matchList });

		return matchList.map((match) => highlightText(match, 'mark'));
	}

	// @ts-expect-error
	const createMatcher = makeRefinable(
		(
			selector:
				| TextQuoteSelector
				| RangeSelector
				| TextPositionSelector
				| CssSelector,
		) => {
			//@ts-expect-error
			const innerCreateMatcher = {
				CssSelector: createCssSelectorMatcher,
				TextQuoteSelector: createTextQuoteSelectorMatcher,
				TextPositionSelector: createTextPositionSelectorMatcher,
				RangeSelector: makeCreateRangeSelectorMatcher(createMatcher),
			}[selector.type];

			if (!innerCreateMatcher) {
				throw new Error(`Unsupported selector type: ${selector.type}`);
			}

			return innerCreateMatcher(selector);
		},
	);

	async function createRangeSelector(
		selector: RangeSelector | TextPositionSelector | CssSelector,
		attrs?: Record<string, string>,
	) {
		console.log({ selector });
		const matchAll = createMatcher(selector);

		const ranges = [];

		// First collect all matches, and only then highlight them; to avoid
		// modifying the DOM while the matcher is running.
		for await (const range of matchAll(articleWrapper)) {
			ranges.push(range);
		}

		return ranges.map((range) => highlightText(range, 'mark', attrs));
	}

	async function highlightSelectorTarget(
		textQuoteSelector: TextQuoteSelector,
		attrs?: Record<string, string>,
	) {
		const matches = createTextQuoteSelectorMatcher(textQuoteSelector)(
			articleWrapper!,
		);

		// Modifying the DOM while searching can mess up; see issue #112.
		// Therefore, we first collect all matches before highlighting them.
		const matchList = [];
		for await (const match of matches) {
			matchList.push(match);
		}

		return matchList.map((match) => highlightText(match, 'mark', attrs));
		// for (const match of matchList) {
		// 	const el = highlightText(match)
		// };
	}

	const annotationCtx = writable(
		new Map<string, Awaited<ReturnType<typeof highlightSelectorTarget>>>(),
	);

	export function deleteAnnotation(id: string) {
		const ctx = $annotationCtx.get(id);
		if (ctx) {
			for (const item of ctx) {
				item.removeHighlights();
			}
		}
		$annotationCtx.delete(id);
	}

	$: if (data.entry?.annotations) {
		console.log(`annotations change`, data.entry.annotations);
		const _annotations = data.entry.annotations;
		if (data.entry.id) {
			const existingIds = _annotations.map((a) => a.id);
			annotations.sync(existingIds);
			// for (const [id, ctx] of $annotationCtx) {
			// 	if (!existingIds.includes(id)) {
			// 		for (const item of ctx) {
			// 			item.removeHighlights();
			// 		}
			// 		$annotationCtx.delete(id);
			// 	}
			// }
		}
	}

	let lastSavedScrollProgress = data.entry?.interactions?.[0]?.progress ?? 0;

	const saveProgressMutation = createMutation({
		mutationFn: async () => {
			if (initializing) {
				return;
			}
			if (!shouldSaveProgress) {
				return;
			}
			if (!data.entry) {
				return;
			}
			return mutation($page, 'saveInteraction', {
				entryId: data.entry.id,
				id: data.entry.interactions?.[0]?.id,
				progress: $scroll,
			});
		},
		onMutate() {
			lastSavedScrollProgress = $scroll;
			//  set query data (and invalidate?);
			if (data.entry?.interactions?.[0]?.id) {
				const id = data.entry.interactions[0].id;
				queryClient.setQueryData<FullEntryDetail>(queryKey, (old) => {
					if (!old) {
						return old;
					}
					if (!old.entry) {
						return old;
					}
					return {
						...old,
						entry: {
							...old.entry,
							interactions: [
								makeInteraction({
									...(old.entry.interactions?.[0] ?? []),
									id,
									progress: lastSavedScrollProgress,
								}),
								...(old.entry.interactions ?? []).slice(1),
							],
						},
					};
				});
			}
			return {
				lastSavedScrollProgress,
			};
		},
		onSuccess(returnedData, _, context) {
			const id = data.entry?.interactions?.[0]?.id ?? returnedData?.id;
			if (id) {
				{
					queryClient.setQueryData<FullEntryDetail>(queryKey, (old) => {
						if (!old) {
							return old;
						}
						if (!old.entry) {
							return old;
						}
						return {
							...old,
							entry: {
								...old.entry,
								interaction: [
									makeInteraction({
										...(old.entry.interactions?.[0] ?? []),
										id,
										progress: lastSavedScrollProgress,
									}),
									...(old.entry.interactions ?? []).slice(1),
								],
							},
						};
					});
				}
			}
			void queryClient.invalidateQueries({
				queryKey: ['entries', 'list'],
			});
			// invalidateEntries(queryClient);
		},
	});

	beforeNavigate(() => {
		$annotationCtx.clear();
		annotations.reset();
		// save progress
		saveProgress.flush();
		$mainnav = {
			center: false,
			entry: undefined,
			show: true,
		};
	});

	/** Variable to track when we're initializing an article. */
	let initializing = false;
	const doneInitializing = () => (initializing = false);

	let shouldSaveProgress = true;

	async function ensureHighlights() {
		console.log('ensureHighlights running');
		// for (const [id, annotation] of Object.entries($annotations)) {
		if (!data.entry?.annotations) {
			return;
		}
		console.time('ensureHighlights');
		for (const annotation of data.entry.annotations) {
			const { id } = annotation;
			const target = annotation.target!;
			const el = articleWrapper?.querySelector(`[data-annotation-id="${id}"]`);
			if (!el) {
				let selector: TextQuoteSelector | TextPositionSelector | undefined =
					getTargetSelector(annotation.target, 'TextQuoteSelector');
				if (!selector?.exact?.trim()) {
					selector = getTargetSelector(
						annotation.target,
						'TextPositionSelector',
					);

                    // TODO: this nesting is ridiculous lol
                    if (!selector) {
                        selector = getTargetSelector(
                            annotation.target,
                            "CssSelector"
                        )
                    }
				}
				if (selector) {
					console.log('ensurehighlights - annotation', { annotation });
					const body =
						!!annotation.body ||
						!isBlankJsonContent(coalesceObjects(annotation.contentData) ?? {});
					console.log('ensurehighligts, body', body);
					const els = await createRangeSelector(selector, {
						'data-annotation-id': id,
						'data-has-body': body ? 'true' : 'false',
						id: `annotation-${annotation.id}`,
					});
					$annotations[id] = {
						...annotation,
						els,
						target,
					};
				}
			}
		}
		console.timeEnd('ensureHighlights');
	}

	const throttledEnsureHighlights = throttle(ensureHighlights, 1000);

	afterUpdate(() => {
		if (initializing) {
			return;
		}
		// TODO throttle this:
		void throttledEnsureHighlights();
	});

	async function setup() {
		if (data.type !== 'article') {
			return;
		}
		if (!articleWrapper) {
			return;
		}
		if (data.entry?.interactions?.[0]?.progress) {
			shouldSaveProgress = false;
			initializing = true;
			$scroll = data.entry.interactions?.[0]?.progress;
			const height =
				document.documentElement.scrollHeight -
				document.documentElement.clientHeight;
			// Wait a second before allowing scroll to save again
			await tick();
			document.documentElement.scrollTo({
				top: $scroll * height,
			});
			setTimeout(() => {
				shouldSaveProgress = true;
			}, 2000);
		}
		const _annotations = data.entry?.annotations;
		if (!_annotations) {
			// wait for scroll
			setTimeout(() => {
				doneInitializing();
			}, 250);
			return;
		}
		void throttledEnsureHighlights();

		// scroll to latest interaction

		// detect hash
		if ($page.url.hash.startsWith('#annotation-')) {
			// then scroll to it
			const id = $page.url.hash.replace('#annotation-', '');
			// window.location.hash = '';
			const el = document.getElementById(`annotation-${id}`);
			if (el) {
				el.scrollIntoView();
				const annotation = _annotations.find((a) => a.id === id);
				await tick();
				if (annotation) {
					annotationRef(el);
				}
			}
		}
		// wait for scroll
		setTimeout(() => {
			doneInitializing();
		}, 250);
	}

	// highlight stored annotations
	afterNavigate(() => {
		void setup();
	});

	popperRef(virtualEl);

	const saveProgress = debounce(
		() => {
			if (!shouldSaveProgress) {
				return;
			}
			if ($saveProgressMutation.isPending) {
				return;
			}
			if (Number.isNaN($scroll)) {
				return;
			}
			// don't save if last saved progress is within .005 of current progress
			if (Math.abs(lastSavedScrollProgress - $scroll) < 0.005) {
				return;
			}
			$saveProgressMutation.mutate();
		},
		5000,
		false,
	);

	const scrolling = writable(false);

	const {
		states: { progress },
	} = getArticleContext();

	const scroll = progress;

	const uscroll = scroll.subscribe(() => {
		if (!shouldSaveProgress) {
			return;
		}
		saveProgress();
	});

	let lastScrollTop = 0;
	const { rightSidebar, scrollingDown } = getEntryContext();

	const setScrollOffset = () => {
		// if (initializing) return;
		// set how far the user has scrolled
		// TODO await tick?
		// TODO This shuoldn't be set if the document is loading (and we scroll to position)
		const scrollTop =
			document.body.scrollTop || document.documentElement.scrollTop;
		const height =
			document.documentElement.scrollHeight -
			document.documentElement.clientHeight;
		const scrollToSet = scrollTop / height;
		if (!Number.isNaN(scrollToSet)) {
			$scroll = scrollToSet;
		}

		// set scrolling direction
		scrollingDown.set(scrollTop > lastScrollTop);
		lastScrollTop = scrollTop;
	};

	const debouncedScroll = debounce(() => {
		scrolling.set(false);
	}, 100);

	function handleScroll(e: Event) {
		scrolling.set(true);
		requestAnimationFrame(setScrollOffset);
		debouncedScroll();
	}

	const mouseDown = writable(false);

	onMount(() => {
		if (browser) {
			document.addEventListener('selectionchange', handleSelect);
			document.addEventListener('scroll', handleScroll, { passive: true });
			document.addEventListener('mousedown', () => {
				mouseDown.set(true);
			});
			document.addEventListener('mouseup', () => {
				mouseDown.set(false);
			});
		}
	});

	onDestroy(() => {
		if (browser) {
			document.removeEventListener('selectionchange', handleSelect);
			document.removeEventListener('scroll', handleScroll);
			document.removeEventListener('mousedown', () => {
				mouseDown.set(true);
			});
			document.removeEventListener('mouseup', () => {
				mouseDown.set(false);
			});
		}
		uscroll();
	});

	let activeEditor: Editor | null = null;

	function handleSaveAnnotation(contentData: JSONContent) {
		if (!data.entry?.id) {
			return;
		}
		const id = $activeAnnotationId ?? nanoid();
		activeAnnotation.hide();
		if (!$activeAnnotation) {
			return;
		}
		// optimistic update
		if (annotations.hasTemp()) {
			annotations.saveTemp();
		}
		$annotations[id]?.els.forEach((el) => {
			el.highlightElements.forEach((el) => {
				el.setAttribute('data-has-body', 'true');
			});
		});
		if (id) {
			// update
			$annotations[id] = {
				...$annotations[id],
				...$activeAnnotation,
				contentData,
				id,
			};
		}
		toast.promise(
			$annotateMutation.mutateAsync({
				contentData,
				entryId: data.entry.id,
				html: $activeAnnotation.html,
				id,
				target: $activeAnnotation.target,
				type: 'annotation',
			}),
			{
				error: 'Failed to save note',
				loading: 'Saving note...',
				success: 'Note saved!',
			},
		);
		activeAnnotationId.set(null);
	}

	let showImageMenu = false;
	let _activeImageUrl: string | null = null;
	let _activeImageElement: HTMLImageElement | null = null;
	let imagePortal: HTMLElement | undefined = undefined;

	const [editMenuRef, editMenuContent] = createPopperActions({
		modifiers: [
			{
				name: 'offset',
				options: {
					offset: [0, 4],
				},
			},
		],
	});
	let showEditMenu = false;

	let _active_annotation_id: string | null = null;

	function handlePointerDown(e: PointerEvent) {
		const target = e.target;
		if (!isAnnotation(target)) {
			activeAnnotationId.set(null);
			showEditMenu = false;

			// let's see if it's an image, if so show dialog to save it
			if (target instanceof HTMLImageElement) {
				showImageMenu = true;
				_activeImageUrl = target.src;
				_activeImageElement = target;
				e.preventDefault();
			} else {
				showImageMenu = false;
				_activeImageUrl = null;
			}

			return;
		}
		const annotationEl = target.closest('[data-annotation-id]');
		if (!annotationEl) {
			return;
		}
		if (!(annotationEl instanceof HTMLElement)) {
			return;
		}
		const id = annotationEl.dataset.annotationId;
		if (!id) {
			return;
		}
		activeAnnotationId.set(id);
		_active_annotation_id = id;
		console.log({ $activeAnnotationId });
		editMenuRef(target);
		annotationRef(target);
		// usePopper()
		showEditMenu = true;
	}

	let annotationEditMenuEl: HTMLElement;

	const shouldShowAnnotationTooltip = derived(
		[showAnnotationTooltip, scrolling],
		([$showAnnotationTooltip, $scrolling]) => {
			return $showAnnotationTooltip && !$scrolling && data.entry;
		},
	);

	let editorEl: HTMLElement | undefined = undefined;
</script>

{#if showEditMenu}
	<div
		use:editMenuContent
		use:usePortal
		use:focusTrap={{
			allowOutsideClick: false,
			escapeDeactivates: false,
			immediate: true,
			initialFocus: () => annotationEditMenuEl,
			returnFocusOnDeactivate: false,
		}}
		use:useEscapeKeydown={{
			handler: (e) => {
				showEditMenu = false;
			},
		}}
		class="z-10 select-none"
	>
		<div
			class=" z-50 w-auto select-none rounded-md border bg-popover p-1 shadow-md outline-none"
			transition:scale={{
				start: 0.9,
			}}
			tabindex="-1"
			bind:this={annotationEditMenuEl}
		>
			<div class="flex justify-between space-x-2">
				<Button
					class="flex h-auto flex-col space-y-1"
					variant="ghost"
					on:click={() => {
						showEditMenu = false;
						activeAnnotation.show();
					}}
				>
					<EditIcon class="h-5 w-5" />
					<Muted class="text-xs">Edit</Muted>
				</Button>
				<Button
					on:click={() => {
						if (articleWrapper && _active_annotation_id) {
							// this is the scrappy way 'improper' way to do this, but it works for now
							// keeping track of them in state has been buggy otherwise
							const annotations = articleWrapper.querySelectorAll(
								`[data-annotation-id="${_active_annotation_id}"]`,
							);
							for (const annotation of annotations) {
								if (isHTMLElement(annotation)) {
									console.log('removing highlight', annotation);
									removeHighlight(annotation);
								}
							}
							// mutate data object - this ensures that the annotation is removed from the UI
							if (data.entry?.annotations) {
								data.entry.annotations = data.entry.annotations.filter(
									(a) => a.id !== _active_annotation_id,
								);
							}

							$annotateMutation.mutate(
								{
									deleted: new Date(),
									id: _active_annotation_id,
								},
								{
									onSuccess() {
										toast('Deleted annotation', {
											// action: {
											//     label: 'Undo',
											//     onClick: annotations.restore,
											// },
											duration: 7000,
										});
									},
								},
							);
							_active_annotation_id = null;
							showEditMenu = false;
						}
						// activeAnnotationId.set(null);
						// showEditMenu = false;
					}}
					class="flex h-auto flex-col space-y-1"
					variant="ghost"
				>
					<EraserIcon class="h-5 w-5" />
					<Muted class="text-xs">Delete</Muted>
				</Button>
			</div>
		</div>
	</div>
{/if}

<Selection
	on:highlight={async (e) => {
		if (!$selection) {
			clearSelection();
		}
		const id = nanoid();
		const info = await highlight({
			'data-annotation-id': `${id}`,
			id: `annotation-${id}`,
		});

		if (!info) {
			e.preventDefault();
			return;
		}
		$annotateMutation.mutate({
			html: info.html,
			id,
			target: {
				selector: info.selector,
				source: '',
			},
		});
		annotations.add(id, {
			els: info.els,
			id,
			target: {
				selector: info.selector,
				source: '',
			},
		});
		clearSelection();
	}}
	on:annotate={async () => {
		const highlight_info = await highlight();
		clearSelection();
		if (highlight_info) {
			const { els, id, selector, html } = highlight_info;
			const el = els[0]?.highlightElements[0];
			if (el) {
				annotationRef(el);
			}
			annotations.addTemp(id, {
				els,
				html,
				id,
				target: {
					selector,
					source: '',
				},
			});
			await tick();
			$showEditAnnotation = true;
		}
	}}
/>

<EditAnnotationInline
	contentAction={annotationContent}
	show={$showEditAnnotation && !!data.entry}
	contentData={$activeAnnotationFromQuery?.contentData ?? undefined}
	on:cancel={() => {
		activeAnnotation.hide();
		if (annotations.hasTemp()) {
			annotations.removeTemp();
		}
		activeAnnotationId.set(null);
	}}
	on:save={(e) => {
		handleSaveAnnotation(e.detail.contentData);
	}}
/>

<div
	class="prose prose-stone dark:prose-invert mx-auto prose-pre:text-balance prose-a:transition-colors"
>
	<header class="flex flex-col gap-2 border-b not-prose space-y-3 pb-8">
		{#if data.entry?.uri?.startsWith('http')}
			<div class="flex items-center">
				<img
					src={`https://icons.duckduckgo.com/ip3/${getHostname(
						data.entry.uri,
					)}.ico`}
					class="w-4 h-4 rounded mr-2"
					alt=""
				/>
				<Muted class="text-xs font-medium uppercase tracking-wider"
					>{getHostname(data.entry.uri).replace('www.', '')}</Muted
				>
			</div>{/if}
		<h1
			class="text-3xl md:text-4xl !mt-0 font-extrabold tracking-tight break-words hyphens-manual"
		>
			{data.entry?.title}
		</h1>
		{#if data.entry?.summary}
			<Lead class="not-prose">
				{data.entry.summary}
			</Lead>
		{/if}
		{#if author}
			<a
				class="text-sm font-medium uppercase tracking-wider"
				href="/people/{encodeURIComponent(author)}">{author}</a
			>
		{/if}
		<!-- <BookmarkForm data={data.bookmarkForm} /> -->
		<Attachments {data} />
	</header>

	<!-- eslint-disable-next-line svelte/valid-compile -->
	<div
		bind:this={articleWrapper}
		id="article"
		class="select-text"
		on:pointerdown={handlePointerDown}
		use:drag_context={{
			'context/id': data.entry?.id.toString() ?? '',
			'context/url': data.entry?.uri ?? '',
		}}
	>
		<div
			style:--font-size="{$appearance.fontSize}px"
			style:--line-height={$appearance.lineHeight}
			class={cn(
				$appearance.alignment === 'justify' && 'text-justify',
				$appearance.font === 'newsreader' && 'font-newsreader',
				$appearance.font === 'crimson' && 'font-crimson',
				'text-[length:var(--font-size)]',
				'leading-[--line-height]',
			)}
		>
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html data.entry?.html}
		</div>
	</div>
	{#if data.entry?.bookmark?.status && data.entry?.bookmark?.status !== 'Archive'}
		<form
			class="mb-9 flex justify-center"
			action="?/updateBookmark"
			method="post"
			use:enhance={() => {
				modifyEntry((_entry) => ({
					...data,
					entry: {
						...data.entry,
						bookmark: {
							...data.entry?.bookmark,
							status: 'Archive',
						},
					},
				}));
				return async ({ update, result }) => {
					console.log({ result });
					if (result.type === 'success') {
						// invalidate entries list
						queryClient.invalidateQueries({
							queryKey: ['entries', 'list'],
						});
						if (next_link) {
							goto(next_link);
						}
					} else {
						update();
					}
				};
			}}
		>
			<input type="hidden" name="status" value="Archive" />
			<Button
				variant="outline"
				size="lg"
				on:mouseover={() => {
					preloadData(next_link);
				}}>Archive{currentIndex > -1 && next_link ? ' and next' : ''}</Button
			>
		</form>
	{/if}
</div>

<!-- Image Dialog -->
<Dialog.Root bind:open={showImageMenu}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Image</Dialog.Title>
			<Dialog.Description>What do you want to do?</Dialog.Description>
		</Dialog.Header>
		<div class="flex justify-center">
			<img
				src={_activeImageUrl}
				class="w-32 h-32 object-cover rounded mr-4"
				alt=""
			/>
		</div>
		<div class="flex flex-col sm:grid grid-cols-3">
			<Button
				on:click={async () => {
					if (_activeImageElement) {
						const id = nanoid();

						const css = finder(_activeImageElement, {
							root: articleWrapper,
						});

						const html = DOMPurify.sanitize(_activeImageElement.outerHTML);

						const els = await createRangeSelector(
							{
								type: 'CssSelector',
								value: css,
							},
							{
								'data-annotation-id': id,
								id: `annotation-${id}`,
							},
						);

						$annotateMutation.mutate({
							html,
							id,
							target: {
								selector: {
									type: 'CssSelector',
									value: css,
								},
								source: '',
							},
						});
						annotations.add(id, {
							els,
							html,
							id,
							target: {
								selector: {
									type: 'CssSelector',
									value: css,
								},
								source: '',
							},
						});
						clearSelection();
                        showImageMenu = false;
					}
				}}
				class="max-sm:py-6"
				variant="ghost"
			>
				<Highlighter class="h-5 w-5 shrink-0 mr-2" />
				Highlight Image</Button
			>
			<!-- TODO -->
			<!-- <Button class="max-sm:py-6" variant="ghost">
				<EditIcon class="h-5 w-5 shrink-0 mr-2" />
				Annotate Image</Button
			> -->
			<Button
				class="max-sm:py-6"
				variant="ghost"
				on:click={() => {
					showImageMenu = false;
					if (_activeImageUrl) {
						open(_activeImageUrl, '_blank');
						_activeImageUrl = null;
					}
				}}
			>
				<ExternalLink class="h-5 w-5 shrink-0 mr-2" />
				Open Image</Button
			>
		</div>
	</Dialog.Content>
</Dialog.Root>

<!-- {#if $scroll < lastSavedScrollProgress}
	<div class="fixed bottom-0 right-0">scroll to latest position</div>
{/if} -->

<style lang="postcss">
	div :global(p) {
		text-rendering: optimizeLegibility;
	}

	.prose :global(mark[data-annotation-id]) {
		@apply cursor-pointer;
	}

	#article :global(mark > img) {
		@apply rounded ring-8 ring-yellow-400/50;
	}
</style>
