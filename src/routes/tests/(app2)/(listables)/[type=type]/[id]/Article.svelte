<script lang="ts">
	import {
		useEscapeKeydown,
		usePortal,
	} from '@melt-ui/svelte/internal/actions';
	import { draggable } from '@neodrag/svelte';
	import { createMutation, useQueryClient } from '@tanstack/svelte-query';
	import debounce from 'just-debounce-it';
	import throttle from 'just-throttle';
	import { EditIcon, EraserIcon, Highlighter } from 'lucide-svelte';
	import { afterUpdate, getContext, onDestroy, onMount, tick } from 'svelte';
	import { derived, type Writable, writable } from 'svelte/store';
	import { scale } from 'svelte/transition';
	import { createPopperActions } from 'svelte-popperjs';
	import { toast } from 'svelte-sonner';

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
		createTextQuoteSelectorMatcher,
		describeTextPosition,
		describeTextQuote,
	} from '$lib/annotator';
	import { highlightText } from '$lib/annotator/highlighter';
	import type { TextQuoteSelector } from '$lib/annotator/types';
	import Button from '$lib/components/ui/Button.svelte';
	import { Lead, Muted } from '$lib/components/ui/typography';
	import { isAnnotation, makeAnnotation, makeInteraction } from '$lib/helpers';
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
	import { getHostname } from '$lib/utils';
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

	const {
		activeAnnotation,
		activeAnnotationId,
		annotations,
		showEditAnnotation,
	} = createAnnotationStore();

	export let data: PageData;

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
			void queryClient.invalidateQueries({
				queryKey: ['entries'],
			});
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
		placement: 'right',
		strategy: 'fixed',
	});

	let articleWrapper: HTMLElement | undefined = undefined;

	const clearSelection = () => window.getSelection()?.removeAllRanges();
	const highlight = async (
		attrs?: Record<string, string>,
	): Promise<
		| {
				els: Awaited<ReturnType<typeof highlightSelectorTarget>>;
				exact: string;
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
		const text_position_selector = describeTextPosition(range, articleWrapper);
		const { start } = text_position_selector;
		const text_quote_selector = await describeTextQuote(range, articleWrapper);
		const { exact } = text_quote_selector;
		const id = $activeAnnotationId ?? nanoid();
		const els = await highlightSelectorTarget(text_quote_selector, {
			'data-annotation-id': id,
			'data-has-body': 'false',
			id: `annotation-${id}`,
			...attrs,
		});
		return {
			els,
			exact,
			id,
			selector: [text_quote_selector, text_position_selector],
			start,
		};
	};

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

	let lastSavedScrollProgress = data.entry?.interaction?.progress ?? 0;

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
				id: data.entry.interaction?.id,
				progress: $scroll,
			});
		},
		onMutate() {
			lastSavedScrollProgress = $scroll;
			//  set query data (and invalidate?);
			if (data.entry?.interaction?.id) {
				const id = data.entry.interaction.id;
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
							interaction: makeInteraction({
								...old.entry.interaction,
								id,
								progress: lastSavedScrollProgress,
							}),
						},
					};
				});
			}
			return {
				lastSavedScrollProgress,
			};
		},
		onSuccess(returnedData, _, context) {
			const id = data.entry?.interaction?.id ?? returnedData?.id;
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
								interaction: makeInteraction({
									id,
									progress: context?.lastSavedScrollProgress ?? $scroll,
								}),
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
				const selector = getTargetSelector(
					annotation.target,
					'TextQuoteSelector',
				);
				if (selector) {
					const els = await highlightSelectorTarget(selector, {
						'data-annotation-id': id,
						'data-has-body': `${!!(annotation.body ?? annotation.contentData)}`,
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
		if (data.entry?.interaction?.progress) {
			shouldSaveProgress = false;
			initializing = true;
			$scroll = data.entry.interaction.progress;
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

	function handleSaveAnnotation() {
		if (!activeEditor) {
			return;
		}
		const contentData = activeEditor.getJSON();
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
	let imagePortal: HTMLElement | undefined = undefined;
	function handleMouseMove(e: MouseEvent) {
		if (
			e.target instanceof HTMLImageElement ||
			(e.target instanceof Element && e.target.closest('[data-image-menu]'))
		) {
			// TODO
			showImageMenu = true;
			const container = e.target.parentElement;
			if (container) {
				imagePortal = container;
				container.style.position = 'relative';
			}
		} else {
			showImageMenu = false;
			imagePortal = undefined;
		}
	}

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
	function handlePointerDown(e: PointerEvent) {
		const target = e.target;
		if (!isAnnotation(target)) {
			activeAnnotationId.set(null);
			showEditMenu = false;
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

	function handleKeydown(event: KeyboardEvent) {
		if ($shouldShowAnnotationTooltip) {
			// then listen for the "h" and "a" keys to highlight or annotate, respectively
			if (event.key === 'h') {
				// highlight
				const button = document.getElementById('highlight-button');
				if (button && button instanceof HTMLButtonElement) {
					button.click();
				}
			}
			if (event.key === 'a') {
				// annotate
				const button = document.getElementById('annotate-button');
				if (button && button instanceof HTMLButtonElement) {
					button.click();
				}
			}
		}
	}

	let editorEl: HTMLElement | undefined = undefined;
</script>

<svelte:window on:keydown={handleKeydown} />

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
						if ($activeAnnotationId) {
							activeAnnotation.remove();
							$annotateMutation.mutate({
								deleted: new Date(),
								id: $activeAnnotationId,
							});
							toast('Deleted annotation', {
								action: {
									label: 'Undo',
									onClick: annotations.restore,
								},
								duration: 7000,
							});
						}
						activeAnnotationId.set(null);
						showEditMenu = false;
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

{#if $shouldShowAnnotationTooltip}
	<!-- Note: should this be popover? Using some classes from shadcn/ui/hover card -->
	<div
		use:popperContent
		class="{$mouseDown
			? 'pointer-events-none'
			: 'pointer-events-auto-'} z-10 select-none"
	>
		<div
			class="z-50 w-auto select-none rounded-md border bg-popover p-1 shadow-md outline-none"
			in:scale={{
				delay: 50,
				start: 0.9,
			}}
		>
			<div class="flex justify-between space-x-2">
				<Tooltip.Root>
					<Tooltip.Trigger>
						<Button
							id="highlight-button"
							on:click={async (e) => {
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
							type="submit"
							class="flex h-auto flex-col space-y-1"
							variant="ghost"
						>
							<Highlighter class="h-5 w-5" />
							<Muted class="text-xs">Highlight</Muted>
						</Button>
					</Tooltip.Trigger>

					<Tooltip.Content class="flex items-center gap-2">
						<span>Highlight this passage</span>
						<Kbd>h</Kbd>
					</Tooltip.Content>
				</Tooltip.Root>

				<Tooltip.Root>
					<Tooltip.Trigger>
						<Button
							id="annotate-button"
							on:click={async (e) => {
								// show annotation menu and grab annotation
								// clearSelection();
								const highlight_info = await highlight();
								clearSelection();
								if (highlight_info) {
									const { els, id, selector } = highlight_info;
									const el = els[0]?.highlightElements[0];
									if (el) {
										annotationRef(el);
									}
									annotations.addTemp(id, {
										els,
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
							variant="ghost"
							class="flex h-auto flex-col space-y-1"
						>
							<EditIcon class="h-5 w-5" />
							<Muted class="text-xs">Annotate</Muted>
						</Button>
					</Tooltip.Trigger>
					<Tooltip.Content>
						<span>Annotate this passage</span>
						<Kbd>a</Kbd>
					</Tooltip.Content>
				</Tooltip.Root>
			</div>
		</div>
	</div>
{/if}

{#if $showEditAnnotation && data.entry}
	<div
		use:annotationContent
		use:usePortal
		use:focusTrap={{
			allowOutsideClick: true,
			escapeDeactivates: true,
			immediate: true,
			initialFocus: () => editorEl,
			returnFocusOnDeactivate: false,
		}}
		use:useEscapeKeydown={{
			handler: activeAnnotation.hide,
		}}
		class="z-10"
	>
		<!-- use:draggable -->
		<div
			in:scale={{
				duration: 200,
				start: 0.9,
			}}
			use:draggable
			class={cn(
				'z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none',
				'flex flex-col gap-y-4 w-80 max-w-xs',
			)}
		>
			<Editor
				bind:el={editorEl}
				alwaysTabbable
				autofocus
				id={$activeAnnotationId ?? undefined}
				content={$activeAnnotation?.contentData ?? undefined}
				blank
				focusRing={false}
				class="sm:shadow-none shadow-none border-none sm:px-4 px-4 py-6"
				bind:this={activeEditor}
				options={{
					autofocus: 'end',
				}}
			/>
			<div class="flex justify-end gap-3">
				<Button
					on:click={() => {
						activeAnnotation.hide();
						if (annotations.hasTemp()) {
							annotations.removeTemp();
						}
						activeAnnotationId.set(null);
					}}
					size="sm"
					variant="secondary"
				>
					Cancel
				</Button>
				<Button
					size="sm"
					on:click={() => {
						handleSaveAnnotation();
					}}
				>
					Save
				</Button>
			</div>
		</div>
	</div>
{/if}

<div
	class="prose prose-stone dark:prose-invert mx-auto prose-pre:text-balance prose-a:transition-colors hover:prose-a:text-accent"
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
				href="/tests/people/{encodeURIComponent(author)}">{author}</a
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
		on:mousemove={handleMouseMove}
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
	{#if data.entry?.bookmark?.status !== 'Archive'}
		<form
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
			<Button on:mouseover={() => {
                preloadData(next_link)
            }}>Archive{currentIndex > -1 && next_link ? ' and next' : ''}</Button
			>
		</form>
	{/if}
</div>

{#if showImageMenu}
	<div
		data-image-menu
		class="absolute top-0 right-0"
		use:usePortal={imagePortal}
	>
		<Button>Image Menu</Button>
	</div>
{/if}

{#if $scroll < lastSavedScrollProgress}
	<div class="fixed bottom-0 right-0">scroll to latest position</div>
{/if}

<style lang="postcss">
	div :global(p) {
		text-rendering: optimizeLegibility;
	}

	.prose :global(mark[data-annotation-id]) {
		@apply cursor-pointer;
	}
</style>
