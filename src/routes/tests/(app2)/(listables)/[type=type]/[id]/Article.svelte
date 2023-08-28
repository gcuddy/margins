<script lang="ts" context="module">
	// mapping of id -> info
	export type AnnotationCtx = Writable<
		Map<
			string,
			{
				selector: TargetSchema['selector'];
				els: Array<{
					highlightElements: Array<HTMLElement>;
					removeHighlights: () => void;
				}>;
			}
		>
	>;
</script>

<script lang="ts">
	import { createFocusTrap, useEscapeKeydown, usePortal } from '@melt-ui/svelte/internal/actions';
	import { draggable } from '@neodrag/svelte';
	import { createMutation, useQueryClient } from '@tanstack/svelte-query';
	import debounce from 'just-debounce-it';
	import { DeleteIcon, EditIcon, EraserIcon, Highlighter } from 'lucide-svelte';
	import { afterUpdate, getContext, onDestroy, onMount, tick } from 'svelte';
	import { derived, type Writable, writable } from 'svelte/store';
	import { scale } from 'svelte/transition';
	import { createPopperActions } from 'svelte-popperjs';
	import { toast } from 'svelte-sonner';

	import { browser } from '$app/environment';
	import { enhance } from '$app/forms';
	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import Editor from '$components/ui/editor/Editor.svelte';
	import drag_context from '$lib/actions/drag-context';
	import focusTrap from '$lib/actions/focus-trap';
	import inView from '$lib/actions/inview';
	import type { Annotation, TargetSchema } from '$lib/annotation';
	import {
		createTextQuoteSelectorMatcher,
		describeTextPosition,
		describeTextQuote
	} from '$lib/annotator';
	import { highlightText } from '$lib/annotator/highlighter';
	import type { TextQuoteSelector } from '$lib/annotator/types';
	import Button from '$lib/components/ui/Button.svelte';
	import { popoverVariants } from '$lib/components/ui/popover/PopoverContent.svelte';
	import { Lead, Muted } from '$lib/components/ui/typography';
	import { isAnnotation, makeAnnotation, makeInteraction } from '$lib/helpers';
	import { nanoid } from '$lib/nanoid';
	import { mutation,type MutationInput, type QueryOutput } from '$lib/queries/query';
	import type { FullEntryDetail } from '$lib/queries/server';
	import { createAnnotationStore } from '$lib/stores/annotations';
	import mq from '$lib/stores/mq';
	import type { Type } from '$lib/types';
	import { getHostname } from '$lib/utils';
	import { getTargetSelector } from '$lib/utils/annotations';
	import { numberOrString } from '$lib/utils/misc';
	import { cn } from '$lib/utils/tailwind';

	import type { MenuBar } from '../../../MainNav.svelte';
	import { getAppearanceContext, getArticleContext } from '../ctx';
	import type { PageData } from './$types';
	import Attachments from './Attachments.svelte';
	import image_tools from './images';

	const {
		annotations,
		updateAnnotationMutation,
		activeAnnotation,
		activeAnnotationId,
		showEditAnnotation
	} = createAnnotationStore();

	$: console.log({ $annotations });

	$: console.log({ $activeAnnotationId });

	export let data: PageData;

	$: author = data.entry?.bookmark?.author ?? data.entry?.author;

	const mainnav: Writable<MenuBar> = getContext('mainnav');

	let align = ['left', 'justify'] as const;
	type Alignment = (typeof align)[number];
	let alignment: Alignment = align[0];

	let fonts = ['sans', 'newsreader', 'crimson'] as const;
	type Font = (typeof fonts)[number];
	let font: Font = fonts[0];

	let fontSize = 16;
	let lineHeight = 1.75;

	type Opts = {
		alignment: Alignment;
		font: Font;
		fontSize: number;
		lineHeight: number;
		autoHide: boolean;
		focusMode: boolean;
	};
	const defaultOpts: Opts = {
		alignment,
		font,
		fontSize,
		lineHeight,
		autoHide: true,
		focusMode: false
	};

	const appearance = getAppearanceContext();

	const queryClient = useQueryClient();

	$: queryKey = [
		'entries',
		'detail',
		{
			input: {
				id: numberOrString($page.params.id),
				type: $page.data.type as Type
			}
		}
	];

	const annotateMutation = createMutation({
		mutationFn: async (input: MutationInput<'save_note'>) => {
			console.log({ data, input });
			if (!data.entry) return;
			console.log('saving annotation');
			return mutation($page, 'save_note', {
				entryId: data.entry.id,
				...input
			});
		},
		async onMutate(newData) {
			await queryClient.cancelQueries({
				queryKey: ['entries']
			});

			// Snapshot the previous value
			const previousEntryData = queryClient.getQueryData<QueryOutput<'entry_by_id'>>(queryKey);

			console.log({ previousEntryData });

			// // Optimistically update to the new value
			const newQueryData = queryClient.setQueryData<QueryOutput<'entry_by_id'>>(queryKey, (old) => {
				if (!old) return old;
				if (!old.entry) return old;

				const ids = Array.isArray(newData.id) ? newData.id : [newData.id];

				const newAnnotations = ids.map((id) => {
					const { tags, ...rest } = newData;
					// TODO: tags
					return makeAnnotation({
						// @ts-expect-error TODO: why is ts complaining about this?
						id: id!,
						...rest
					});
				});

				const oldIds = old.entry.annotations?.map((a) => a.id) ?? [];
				const annotationsToAdd = newAnnotations.filter((a) => !oldIds.includes(a.id));

				console.log({ oldIds, annotationsToAdd, old: old.entry.annotations, newAnnotations });

				const updatedAnnotations = (old.entry.annotations || [])
					.map((annotation) => {
						if (ids.includes(annotation.id)) {
							return {
								...annotation,
								...newAnnotations.find((a) => a.id === annotation.id)
							};
						}
						return annotation;
					})
					.concat(annotationsToAdd);

				console.log({ updatedAnnotations });
				return {
					...old,
					entry: {
						...old.entry,
						annotations: [...updatedAnnotations]
					}
				};
			});
			console.log({ newQueryData });

			// // Return a context object with the snapshotted value
			return { previousEntryData };
		},
		onError: (err, newTodo, context) => {
			toast.error('Failed to save annotation');
			if (context) {
				queryClient.setQueryData(queryKey, context.previousEntryData);
			}
		},
		onSettled() {
			queryClient.invalidateQueries({
				queryKey: ['entries']
			});
		}
	});

	const selection = writable<Selection | null>(null);

	const showAnnotationTooltip = derived(selection, ($selection) => {
		if (!$selection?.rangeCount || $selection.isCollapsed) return false;
		const range = $selection.getRangeAt(0);
		const parent = range.commonAncestorContainer.parentElement;
		if (!parent) return false;
		if (!parent.closest('#article')) return false;
		if (
			range.startContainer.parentElement?.closest('[data-annotation-id]') ||
			range.endContainer.parentElement?.closest('[data-annotation-id]')
		)
			return false;
		const text = range.toString();
		return text.length > 0;
	});

	const virtualEl = derived(selection, ($selection) => {
		if (!$selection?.rangeCount || $selection.isCollapsed)
			return {
				getBoundingClientRect: () =>
					({
						top: 0,
						left: 0,
						width: 0,
						height: 0,
						bottom: 0,
						right: 0
					} as DOMRect)
			};
		const range = $selection.getRangeAt(0);
		return {
			getBoundingClientRect: () => range.getBoundingClientRect()
		};
	});

	function handleSelect(e: Event) {
		if (data.type !== 'article') return;
		const fn = () => {
			selection.set(window.getSelection());
		};
		requestAnimationFrame(fn);
	}
	const [popperRef, popperContent] = createPopperActions({
		strategy: 'fixed',
		placement: $mq.desktop ? 'top' : 'bottom',
		modifiers: [
			{
				name: 'offset',
				options: {
					offset: [0, 12]
				}
			}
		]
	});
	const [annotationRef, annotationContent] = createPopperActions({
		modifiers: [
			{
				name: 'offset',
				options: {
					offset: [0, 12]
				}
			}
		],
		placement: 'bottom',
		strategy: 'fixed'
	});

	let articleWrapper: HTMLElement | undefined = undefined;

	const clearSelection = () => window.getSelection()?.removeAllRanges();
	const highlight = async (
		attrs?: Record<string, string>
	): Promise<
		| {
				selector: TargetSchema['selector'];
				els: Awaited<ReturnType<typeof highlightSelectorTarget>>;
				start: number;
				exact: string;
				id: string;
		  }
		| undefined
	> => {
		const range = $selection?.getRangeAt(0);
		if (!range || range.collapsed) return;
		if (!articleWrapper) return;
		const text_position_selector = describeTextPosition(range, articleWrapper);
		const { start } = text_position_selector;
		const text_quote_selector = await describeTextQuote(range, articleWrapper);
		const { exact } = text_quote_selector;
		console.log({ text_position_selector, text_quote_selector });
		const id = $activeAnnotationId || nanoid();
		const els = await highlightSelectorTarget(text_quote_selector, {
			'data-annotation-id': id,
			'data-has-body': 'false',
			id: `annotation-${id}`,
			...attrs
		});
		return {
			selector: [text_quote_selector, text_position_selector],
			els,
			start,
			exact,
			id
		};
	};

	async function highlightSelectorTarget(
		textQuoteSelector: TextQuoteSelector,
		attrs?: Record<string, string>
	) {
		const matches = createTextQuoteSelectorMatcher(textQuoteSelector)(articleWrapper!);

		// Modifying the DOM while searching can mess up; see issue #112.
		// Therefore, we first collect all matches before highlighting them.
		const matchList = [];
		for await (const match of matches) matchList.push(match);

		return matchList.map((match) => highlightText(match, 'mark', attrs));
		// for (const match of matchList) {
		// 	const el = highlightText(match)
		// };
	}

	const annotationCtx = writable(
		new Map<string, Awaited<ReturnType<typeof highlightSelectorTarget>>>()
	);

	export function deleteAnnotation(id: string) {
		console.log('DELETING ANNOTATION');
		const ctx = $annotationCtx.get(id);
		if (ctx) {
			for (const item of ctx) {
				item.removeHighlights();
			}
		}
		$annotationCtx.delete(id);
	}

	$: if (data.entry?.annotations) {
		console.log('entry change!');
		const _annotations = data.entry?.annotations;
		if (data.entry?.id) {
			const existingIds = _annotations.map((a) => a.id);
			annotations.sync(existingIds);
			// for (const [id, ctx] of $annotationCtx) {
			// 	console.log({ id, ctx, annotations });
			// 	if (!existingIds.includes(id)) {
			// 		console.log('deleting');
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
			if (initializing) return;
			if (!shouldSaveProgress) return;
			console.log('mutating');
			return mutation($page, 'saveInteraction', {
				entryId: data.entry!.id,
				id: data.entry?.interaction?.id,
				progress: $scroll
			});
		},
		onMutate() {
			lastSavedScrollProgress = $scroll;
			//  set query data (and invalidate?);
			if (data.entry?.interaction?.id) {
				const id = data.entry?.interaction?.id;
				queryClient.setQueryData<FullEntryDetail>(queryKey, (old) => {
					if (!old) return old;
					if (!old.entry) return old;
					return {
						...old,
						entry: {
							...old.entry,
							interaction: makeInteraction({
								id,
								progress: lastSavedScrollProgress
							})
						}
					};
				});
			}
			return {
				lastSavedScrollProgress
			};
		},
		onSuccess(returnedData, _, context) {
			const id = data.entry?.interaction?.id ?? returnedData?.id;
			if (id) {
				{
					queryClient.setQueryData<FullEntryDetail>(queryKey, (old) => {
						if (!old) return old;
						if (!old.entry) return old;
						return {
							...old,
							entry: {
								...old.entry,
								interaction: makeInteraction({
									id,
									progress: context?.lastSavedScrollProgress ?? $scroll
								})
							}
						};
					});
				}
			}
			queryClient.invalidateQueries({
				queryKey: ['entries']
			});
		}
	});

	beforeNavigate(() => {
		$annotationCtx.clear();
		annotations.reset();
		// save progress
		saveProgress.flush();
		$mainnav = {
			show: true,
			center: false,
			entry: undefined
		};
	});

	/** Variable to track when we're initializing an article. */
	let initializing = false;
	const doneInitializing = () => tick().then(() => (initializing = false));

	const jumping = getContext('jumping') ;

	let shouldSaveProgress = true;
	$: console.log({ shouldSaveProgress });

	async function ensureHighlights() {
		console.log('ensure highlights', { $annotations, annotations: data.entry?.annotations });
		// for (const [id, annotation] of Object.entries($annotations)) {
		if (!data.entry?.annotations) return;
		for (const annotation of data.entry?.annotations) {
			const { id } = annotation;
            let target = annotation.target as TargetSchema;
			const el = articleWrapper?.querySelector(`[data-annotation-id="${id}"]`);
			console.log({ el });
			if (!el) {
				const selector = getTargetSelector(annotation.target, 'TextQuoteSelector');
				if (selector) {
					const els = await highlightSelectorTarget(selector, {
						'data-annotation-id': id,
						'data-has-body': `${!!(annotation.body ?? annotation.contentData)}`,
						id: `annotation-${annotation.id}`
					});
					$annotations[id] = {
						...annotation,
                        target,
						els
					};
				}
			}
		}
	}

	afterUpdate(() => {
		console.log('after update');
		if (initializing) return;
		// TODO throttle this:
		ensureHighlights();
	});

	// highlight stored annotations
	afterNavigate(async () => {
		if (data.type !== 'article') return;
		if (!articleWrapper) return;
		$mainnav.entry = data.entry;
		console.log({ data });
		console.log('scrolling to', data.entry?.interaction?.progress);
		if (data.entry?.interaction?.progress) {
			shouldSaveProgress = false;
			console.log('scrolling to', data.entry?.interaction?.progress);
			initializing = true;
			$scroll = data.entry.interaction.progress;
			const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
			console.log({
				$scroll,
				height,
				top: $scroll * height
			});
			// Wait a second before allowing scroll to save again
			tick().then(() => {
				document.documentElement.scrollTo({
					top: $scroll * height
				});
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
		console.log(`Setting up annotations`, { _annotations });
		for (const annotation of _annotations) {
			let target = annotation.target as TargetSchema;
			const selector = getTargetSelector(target, 'TextQuoteSelector');
			if (selector) {
				const els = await highlightSelectorTarget(selector, {
					'data-annotation-id': annotation.id,
					'data-has-body': `${!!(annotation.body ?? annotation.contentData)}`,
					id: `annotation-${annotation.id}`
				});
				$annotationCtx.set(annotation.id, els);
				$annotations[annotation.id] = {
					...annotation,
					target,
					els
				};
			}
			console.log({ selector });
		}

		// scroll to latest interaction

		// detect hash
		const els = document.querySelector('[data-annotation-id]');
		console.log({ els });
		if ($page.url.hash.startsWith('#annotation-')) {
			// then scroll to it
			const id = $page.url.hash.replace('#annotation-', '');
			// window.location.hash = '';
			const el = document.getElementById(`annotation-${id}`);
			console.log({ el });
			if (el) {
				el.scrollIntoView();
				const annotation = _annotations.find((a) => a.id === id);
				tick().then(() => {
					console.log({ annotation });
					if (annotation) {
						annotationRef(el);
					}
					$jumping = false;
				});
			}
		}
		// wait for scroll
		setTimeout(() => {
			doneInitializing();
		}, 250);
	});

	popperRef(virtualEl);

	const saveProgress = debounce(
		() => {
			console.log({ shouldSaveProgress, $saveProgressMutation });
			if (!shouldSaveProgress) return;
			if ($saveProgressMutation.isPending) return;
			if (Number.isNaN($scroll)) return;
			console.log('saving');
			// don't save if last saved progress is within .005 of current progress
			console.log({ lastSavedScrollProgress, $scroll });
			if (Math.abs(lastSavedScrollProgress - $scroll) < 0.005) return;
			$saveProgressMutation.mutate();
		},
		5000,
		false
	);

	const scrolling = (getContext('scrolling') ) ?? writable(false);

	const {
		states: { progress }
	} = getArticleContext();

	let scroll = progress;

	const uscroll = scroll.subscribe(() => {
		if (!shouldSaveProgress) return;
		saveProgress();
	});

	let lastScrollTop = 0;
	export let scrollingDown: Writable<boolean> = getContext('scrollingDown') || writable(false);

	const uScrollingDown = scrollingDown.subscribe((down) => {
		console.log({ down, $appearance, lastScrollTop });
		down && $appearance.autoHide ? ($mainnav.show = false) : ($mainnav.show = true);
	});

	const setScrollOffset = () => {
		// console.log({ initializing });
		// if (initializing) return;
		// set how far the user has scrolled
		// TODO await tick?
		// TODO This shuoldn't be set if the document is loading (and we scroll to position)
		const scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
		const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
		const scrollToSet = scrollTop / height;
		console.log({ scrollTop, height, scrollToSet });
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
			document.addEventListener('mousedown', () => { mouseDown.set(true); });
			document.addEventListener('mouseup', () => { mouseDown.set(false); });
		}
	});

	onDestroy(() => {
		if (browser) {
			document.removeEventListener('selectionchange', handleSelect);
			document.removeEventListener('scroll', handleScroll);
			document.removeEventListener('mousedown', () => { mouseDown.set(true); });
			document.removeEventListener('mouseup', () => { mouseDown.set(false); });
		}
		uscroll();
		uScrollingDown();
	});

	let temporaryAnnotationHighlight: Awaited<ReturnType<typeof highlight>> | undefined = undefined;

	let activeEditor: Editor;

	export let options_el: HTMLElement;

	const hover_context = new Map();
	hover_context.set('annotation_ctx', annotationCtx);
	// hovers.setup({
	// 	context: hover_context
	// });

	const [editMenuRef, editMenuContent] = createPopperActions({
		modifiers: [
			{
				name: 'offset',
				options: {
					offset: [0, 4]
				}
			}
		]
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
		if (!annotationEl) return;
		if (!(annotationEl instanceof HTMLElement)) return;
		const id = annotationEl.dataset.annotationId;
		if (!id) return;
		activeAnnotationId.set(id);
		editMenuRef(target);
		annotationRef(target);
		// usePopper()
		showEditMenu = true;
	}

	const hover_entry: boolean = getContext('hover_entry');

	let annotationEditMenuEl: HTMLElement;

	const { useFocusTrap } = createFocusTrap({
		immediate: true,
		escapeDeactivates: false,
		allowOutsideClick: false,
		returnFocusOnDeactivate: false,
		initialFocus: () => annotationEditMenuEl
	});
</script>

{#if showEditMenu}
	<div
		use:editMenuContent
		use:usePortal
		use:focusTrap={{
			immediate: true,
			escapeDeactivates: false,
			allowOutsideClick: false,
			returnFocusOnDeactivate: false,
			initialFocus: () => annotationEditMenuEl
		}}
		use:useEscapeKeydown={{
			handler: (e) => {
				console.log({ e });
				showEditMenu = false;
			}
		}}
		class="z-10 select-none"
	>
		<div
			class=" z-50 w-auto select-none rounded-md border bg-popover p-1 shadow-md outline-none"
			transition:scale={{
				start: 0.9
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
								id: $activeAnnotationId
							});
							toast('Deleted annotation', {
								action: {
									label: 'Undo',
									onClick: annotations.restore
								},
								duration: 7000
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

{#if $showAnnotationTooltip && $selection && !$scrolling && data.entry}
	<!-- Note: should this be popover? Using some classes from shadcn/ui/hover card -->
	<div
		use:popperContent
		class="{$mouseDown ? 'pointer-events-none' : 'pointer-events-auto-'} z-10 select-none"
	>
		<div
			class=" z-50 w-auto select-none rounded-md border bg-popover p-1 shadow-md outline-none"
			in:scale={{
				delay: 50,
				start: 0.9
			}}
		>
			<div class="flex justify-between space-x-2">
				<Button
					on:pointerdown={async (e) => {
						if (!$selection) {
							clearSelection();
						}
						const id = nanoid();
						const info = await highlight({ 'data-annotation-id': `${id}`, id: `annotation-${id}` });

						if (!info) {
							e.preventDefault();
							return;
						}
						console.log(`About to mutate...`);
						$annotateMutation.mutate({
							id,
							target: {
								source: '',
								selector: info.selector
							}
						});
						annotations.add(id, {
							id,
							target: {
								source: '',
								selector: info.selector
							},
							els: info.els
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
				<Button
					on:pointerdown={async (e) => {
						// show annotation menu and grab annotation
						// clearSelection();
						const highlight_info = await highlight();
						clearSelection();
						if (highlight_info) {
							const { els, id, selector } = highlight_info;
							const el = els[0]?.highlightElements[0];
							if (el) annotationRef(el);
							annotations.addTemp(id, {
								id,
								target: {
									source: '',
									selector
								},
								els
							});
							tick().then(() => {
								$showEditAnnotation = true;
							});
						}
					}}
					variant="ghost"
					class="flex h-auto flex-col space-y-1"
				>
					<EditIcon class="h-5 w-5" />
					<Muted class="text-xs">Annotate</Muted>
				</Button>
			</div>
		</div>
	</div>
{/if}

{#if $showEditAnnotation && data.entry}
	<div
		use:annotationContent
		use:usePortal
		use:focusTrap={{
			immediate: true,
			escapeDeactivates: true,
			allowOutsideClick: true,
			returnFocusOnDeactivate: false
		}}
		use:useEscapeKeydown={{
			handler: activeAnnotation.hide
		}}
		class="z-10"
	>
		<!-- use:draggable -->
		<div
			in:scale={{
				duration: 200,
				start: 0.9
			}}
			use:draggable
			class={cn(popoverVariants(), 'flex flex-col gap-y-4 w-80 max-w-xs')}
		>
			<pre>{$activeAnnotationId}</pre>
			<Editor
				id={$activeAnnotationId ?? undefined}
				content={$activeAnnotation?.contentData ?? undefined}
				blank
				focusRing={false}
				class="sm:shadow-none shadow-none border-none sm:px-4 px-4 py-6"
				bind:this={activeEditor}
				options={{
					autofocus: 'end'
				}}
			/>
			<div class="flex justify-end gap-3">
				<Button
					on:click={() => {
						activeAnnotation.hide();
						if (annotations.hasTemp()) annotations.removeTemp();
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
						activeEditor.save((contentData) => {
							console.log({ contentData, $annotations });
							// TODO here
							if (!data.entry?.id) return;
							console.log({ $activeAnnotationId });
							const id = $activeAnnotationId ?? nanoid();
							activeAnnotation.hide();
							if (!$activeAnnotation) return;
							// optimistic update
							if (annotations.hasTemp()) annotations.saveTemp();
							$annotations[id]?.els.forEach((el) => {
								el.highlightElements.forEach((el) => {
									el.setAttribute('data-has-body', 'true');
								});
							});
							if (id) {
								// update
								$annotations[id] = {
									...$annotations[id],
									contentData
								};
							}
							toast.promise(
								$annotateMutation.mutateAsync({
									entryId: data.entry.id,
									id,
									contentData,
									type: 'annotation',
									target: $activeAnnotation.target
								}),
								{
									loading: 'Saving note...',
									success: 'Note saved!',
									error: 'Failed to save note'
								}
							);
							activeAnnotationId.set(null);
						});
					}}
				>
					Save
				</Button>
			</div>
		</div>
	</div>
{/if}

<div class="prose prose-stone dark:prose-invert mx-auto prose-pre:text-balance prose-a:transition-colors">
	<header class="flex flex-col gap-2 border-b not-prose space-y-3 pb-8">
		{#if data.entry?.uri?.startsWith('http')}
			<div class="flex items-center">
				<img
					src={`https://icons.duckduckgo.com/ip3/${getHostname(data.entry?.uri)}.ico`}
					class="w-4 h-4 rounded mr-2"
				/>
				<Muted class="text-xs font-medium uppercase tracking-wider"
					>{getHostname(data.entry?.uri).replace('www.', '')}</Muted
				>
			</div>{/if}
		<h1
			use:inView={{
				top: 56
			}}
			on:enter={() => {
				$mainnav.center = false;
			}}
			on:exit={() => {
				$mainnav.center = true;
			}}
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
				href="/tests/people/{encodeURIComponent(author ?? '')}">{author}</a
			>
			<!-- <Lead class="not-prose"
				><a href="/tests/people/{encodeURIComponent(data.entry?.author ?? '')}"
					>{data.entry?.author}</a
				></Lead
			> -->
		{/if}
		<!-- <BookmarkForm data={data.bookmarkForm} /> -->
		<Attachments {data} />
	</header>

	<div
		bind:this={articleWrapper}
		id="article"
		class="select-text"
		on:pointerdown={handlePointerDown}
		use:drag_context={{
			'context/id': data.entry?.id.toString() ?? '',
			'context/url': data.entry?.uri ?? ''
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
				'leading-[--line-height]'
			)}
			use:image_tools
		>
			{@html data.entry?.html}
		</div>
	</div>
	{#if data.entry?.bookmark?.status !== 'Archive'}
		<form action="?/updateBookmark" method="post" use:enhance>
			<input type="hidden" name="status" value="Archive" />
			<Button>Archive</Button>
		</form>
	{/if}
</div>

<style>
	div :global(p) {
		text-rendering: optimizeLegibility;
	}

	.prose :global(mark[data-annotation-id]) {
		@apply cursor-pointer;
	}
</style>
