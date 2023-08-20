<script lang="ts" context="module">
	export type AnnotationCtx = Writable<
		Map<
			string,
			{
				highlightElements: HTMLElement[];
				removeHighlights: () => void;
			}[]
		>
	>;

	// export this so that we can access it elsewhere............ (TODO probably should extract it to another component)
	export const currentAnnotation = writable<{
		show: boolean;
		highlight?:
			| {
					selector: TargetSchema['selector'];
					els: {
						highlightElements: HTMLElement[];
						removeHighlights: () => void;
					}[];
			  }
			| undefined;
		annotation?: Partial<Annotation>;
	}>({
		show: false
	});
</script>

<script lang="ts">
	import Button, { buttonVariants } from '$lib/components/ui/Button.svelte';
	import Label from '$lib/components/ui/Label.svelte';
	import NativeSelect from '$lib/components/ui/NativeSelect.svelte';
	import Slider from '$lib/components/ui/Slider.svelte';
	import { cn } from '$lib/utils/tailwind';
	import { AlignLeft, DeleteIcon, EditIcon, Highlighter, Settings2 } from 'lucide-svelte';
	import { persisted } from 'svelte-local-storage-store';
	import type { PageData } from './$types';
	import * as hovers from './annotation-hovers';
    import { makeAnnotation } from "$lib/helpers"

	import { browser, dev } from '$app/environment';
	import { afterNavigate, beforeNavigate, invalidate } from '$app/navigation';
	import { page } from '$app/stores';
	import type { Annotation, TargetSchema } from '$lib/annotation';
	import {
		createTextQuoteSelectorMatcher,
		describeTextPosition,
		describeTextQuote
	} from '$lib/annotator';
	import { highlightText } from '$lib/annotator/highlighter';
	import type { TextQuoteSelector } from '$lib/annotator/types';
	import mq from '$lib/stores/mq';
	import { getContext, onDestroy, onMount, tick } from 'svelte';
	import { Writable, derived, writable } from 'svelte/store';
	import { createPopperActions } from 'svelte-popperjs';
	import AnnotationForm from '$lib/components/AnnotationForm.svelte';
	import { popoverVariants } from '$lib/components/ui/popover/PopoverContent.svelte';
	import { scale } from 'svelte/transition';
	import { H1, Lead, Muted } from '$lib/components/ui/typography';
	import { nanoid } from '$lib/nanoid';
	import BookmarkForm from './BookmarkForm.svelte';
	import EntryOperations from './EntryOperations.svelte';
	import Tooltip from '$lib/components/ui/Tooltip.svelte';
	import { getTargetSelector } from '$lib/utils/annotations';
	import { MutationInput, QueryOutput, mutation, query } from '$lib/queries/query';
	import { elementReady } from '$lib/utils/dom';
	import inView from '$lib/actions/inview';
	import type { MenuBar } from '../../../MainNav.svelte';
	import Switch from '$lib/components/ui/Switch.svelte';
	import { enhance } from '$app/forms';
	import image_tools from './images';
	import drag_context from '$lib/actions/drag-context';
	import { update_entry } from '$lib/state/entries';
	import Attachments from './Attachments.svelte';
	import Editor from '$components/ui/editor/Editor.svelte';
	import { toast } from 'svelte-sonner';
	import { draggable } from '@neodrag/svelte';
	import { getHostname } from '$lib/utils';
	import { createMutation, useQueryClient } from '@tanstack/svelte-query';
	import { numberOrString } from '$lib/utils/misc';
	import type { Type } from '$lib/types';
    import throttle from 'just-throttle';
    import debounce from "just-debounce-it";
	import { getAppearanceContext, getArticleContext } from '../ctx';


	export let data: PageData;

    $: author = data.entry?.bookmark?.author ?? data.entry?.author;

	const mainnav: Writable<MenuBar> = getContext('mainnav');

	let align = ['left', 'justify'] as const;
	type Alignment = typeof align[number];
	let alignment: Alignment = align[0];

	let fonts = ['sans', 'newsreader', 'crimson'] as const;
	type Font = typeof fonts[number];
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
            console.log({data, input})
			if (!data.entry) return;
            console.log("saving annotation")
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
				return {
					...old,
					entry: {
						...old.entry,
						annotations: [
							...(old.entry?.annotations || []),
							makeAnnotation(newData),
						]
					}
				}
			});
            console.log({newQueryData})

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
		if (!$selection || !$selection.rangeCount || $selection.isCollapsed) return false;
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
		if (!$selection || !$selection.rangeCount || $selection.isCollapsed)
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
		placement: 'right',
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
		$currentAnnotation.annotation = {
			...$currentAnnotation.annotation,
			id: $currentAnnotation.annotation?.id || nanoid(),
			target: {
				selector: [text_quote_selector, text_position_selector],
				source: ''
			}
		};
		const els = await highlightSelectorTarget(text_quote_selector, attrs);
		return {
			selector: [text_quote_selector, text_position_selector],
			els,
			start,
			exact
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
		const annotations = data.entry?.annotations;
		if (data.entry?.id) {
			// update_entry(data.entry.id, {
			// 	annotations
			// });
		}
		// find ids in $annotationCtx that are not in annotations, and remove them
		const existingIds = annotations.map((a) => a.id);
		console.log({
			annotations,
			$annotationCtx
		});
		for (const [id, ctx] of $annotationCtx) {
			console.log({ id, ctx, annotations });
			if (!existingIds.includes(id)) {
				console.log('deleting');
				for (const item of ctx) {
					item.removeHighlights();
				}
				$annotationCtx.delete(id);
			}
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
			})
		},
        onMutate(vars) {
            lastSavedScrollProgress = $scroll;
        },
        onSuccess() {
            toast.success(`Saved progress: ${$scroll}`);
            // if (dev) {
            // }
        }
	});

	beforeNavigate(() => {
		$annotationCtx.clear();
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

	const jumping = getContext('jumping') as Writable<boolean>;

    let shouldSaveProgress = true;
    $: console.log({shouldSaveProgress})

	// highlight stored annotations
	afterNavigate(async () => {
		if (data.type !== 'article') return;
		if (!articleWrapper) return;
		$mainnav.entry = data.entry;
		console.log('scrolling to', data.entry?.interaction?.progress);
		if (data.entry?.interaction?.progress) {
            shouldSaveProgress = false;
			console.log('scrolling to', data.entry?.interaction?.progress);
			initializing = true;
			$scroll = data.entry.interaction.progress;
            // Wait a second before allowing scroll to save again
			document.documentElement.scrollTo({
                top: $scroll * document.documentElement.scrollHeight
			});
            setTimeout(() => {
                shouldSaveProgress = true;
            }, 2000)
		}
		const annotations = data.entry?.annotations;
		if (!annotations) {
			// wait for scroll
			setTimeout(() => {
				doneInitializing();
			}, 250);
			return;
		}
		for (const annotation of annotations) {
			let target = annotation.target as TargetSchema;
			const selector = getTargetSelector(target, 'TextQuoteSelector');
			if (selector) {
				const ctx = await highlightSelectorTarget(selector, {
					'data-annotation-id': annotation.id,
					'data-has-body': `${!!annotation.body}`,
					id: `annotation-${annotation.id}`
				});
				$annotationCtx.set(annotation.id, ctx);
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
				// now show currentAnnotation
				const annotation = annotations.find((a) => a.id === id);
				tick().then(() => {
					console.log({ annotation });
					if (annotation) {
						annotationRef(el);
						$currentAnnotation.show = true;
						$currentAnnotation.annotation = annotation;
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

	const saveProgress = debounce(() => {
        console.log({shouldSaveProgress, $saveProgressMutation})
        if (!shouldSaveProgress) return;
        if ($saveProgressMutation.isPending) return;
        console.log('saving')
        // don't save if last saved progress is within .005 of current progress
        console.log({ lastSavedScrollProgress, $scroll });
        if (Math.abs(lastSavedScrollProgress - $scroll) < 0.005) return;
        $saveProgressMutation.mutate();
    }, 2000)

	const scrolling = (getContext('scrolling') as Writable<boolean>) ?? writable(false);

    const { states: { progress }} = getArticleContext();

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
		$scroll = scrollTop / height;

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
		debouncedScroll()
	}

	const mouseDown = writable(false);

	onMount(() => {
		if (browser) {
			document.addEventListener('selectionchange', handleSelect);
			document.addEventListener('scroll', handleScroll, { passive: true });
			document.addEventListener('mousedown', () => mouseDown.set(true));
			document.addEventListener('mouseup', () => mouseDown.set(false));
		}
	});

	onDestroy(() => {
		if (browser) {
			document.removeEventListener('selectionchange', handleSelect);
			document.removeEventListener('scroll', handleScroll);
			document.removeEventListener('mousedown', () => mouseDown.set(true));
			document.removeEventListener('mouseup', () => mouseDown.set(false));
		}
		uscroll();
		uScrollingDown();
	});

	let temporaryAnnotationHighlight: Awaited<ReturnType<typeof highlight>> | undefined = undefined;

	$: console.log({ $currentAnnotation });

	let activeEditor: Editor;

	export let options_el: HTMLElement;

	const hover_context = new Map();
	hover_context.set('annotation_ctx', annotationCtx);
	hovers.setup({
		context: hover_context
	});

	const isAnnotation = (
		el: HTMLElement
	): el is HTMLElement & {
		dataset: {
			annotationId: string;
		};
	} => !!el.dataset.annotationId || !!el.closest('[data-annotation-id]');

	const [editMenuRef, editMenuContent] = createPopperActions();
	let showEditMenu = false;
	function handlePointerDown(e: PointerEvent) {
		const target = e.target as HTMLElement;
		console.log({ target, isAnnotation: isAnnotation(target) });
		if (!isAnnotation(target)) {
			showEditMenu = false;
			return;
		}
		editMenuRef(target);
		showEditMenu = true;
	}

	const hover_entry: boolean = getContext('hover_entry');
</script>

{#if showEditMenu && !scrolling}
	<div use:editMenuContent class="z-10 select-none">
		<div
			class=" z-50 w-auto select-none rounded-md border bg-popover p-1 shadow-md outline-none"
			in:scale={{
				start: 0.9
			}}
		>
			<div class="flex justify-between space-x-2">
				<Button class="flex h-auto flex-col space-y-1" variant="ghost">
					<EditIcon class="h-5 w-5" />
					<Muted class="text-xs">Edit</Muted>
				</Button>
				<Button class="flex h-auto flex-col space-y-1" variant="ghost">
					<DeleteIcon class="h-5 w-5" />
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
						const info = await highlight({ id: `annotation-${id}` });

						if (!info) {
							e.preventDefault();
							return;
						}
                        console.log(`About to mutate...`)
						$annotateMutation.mutate({
							id,
							target: {
								source: '',
								selector: info.selector
							}
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
							const { els } = highlight_info;
							const el = els[0].highlightElements[0];
							temporaryAnnotationHighlight = highlight_info;
							annotationRef(el);
							tick().then(() => {
								$currentAnnotation.show = true;
								$currentAnnotation.highlight = highlight_info;
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

{#if $currentAnnotation.show && data.entry}
	<div use:annotationContent class="z-10">
		<!-- use:draggable -->
		<div
			in:scale={{
				duration: 200,
				start: 0.9
			}}
			use:draggable
			class={cn(popoverVariants(), 'flex flex-col gap-y-4')}
		>
			<Editor
				id={$currentAnnotation.annotation?.id}
				content={$currentAnnotation.annotation?.contentData ?? undefined}
				blank
				class="sm:shadow-none shadow-none border-none sm:px-4 px-4 py-6"
				bind:this={activeEditor}
			/>
			<div class="flex justify-end gap-3">
				<Button
					on:click={() => {
						$currentAnnotation.show = false;
						temporaryAnnotationHighlight?.els.forEach((h) => {
							h.removeHighlights();
						});
						temporaryAnnotationHighlight = undefined;
						currentAnnotation.set({
							show: false
						});
					}}
					variant="secondary"
				>
					Cancel
				</Button>
				<Button
					on:click={() => {
						activeEditor.save((contentData) => {
							// TODO here
							if (!data.entry?.id) return;
							console.log({ $currentAnnotation });
							const id = $currentAnnotation.annotation?.id ?? nanoid();

							$currentAnnotation.show = false;
							if (!$currentAnnotation.highlight) return;
							// optimistic update
							update_entry(data.entry.id, {
								annotations: [
									...(data.entry.annotations ?? []),
									{
										id,
										contentData,
										// type: 'annotation',
										target: {
											source: '',
											selector: $currentAnnotation.highlight?.selector
										},
										exact: null,
										body: null,
										username: $page.data.user_data?.username,
										createdAt: new Date(),
										entryId: data.entry.id,
										start: null,
										title: null
									}
								]
							});
							toast.promise(
								mutation($page, 'save_note', {
									entryId: data.entry.id,
									id,
									contentData,
									type: 'annotation',
									target: {
										source: '',
										selector: $currentAnnotation.highlight?.selector
									}
								}).finally(() => invalidate('entry')),
								{
									loading: 'Saving note...',
									success: 'Note saved!',
									error: 'Failed to save note'
								}
							);
							$currentAnnotation.annotation = undefined;
						});
					}}
				>
					Save
				</Button>
			</div>
			<!-- <AnnotationForm
				draggable
				autofocus
				class={popoverVariants()}
				annotation={$currentAnnotation.annotation}
				entry={data.entry}
				on:cancel={() => {
					$currentAnnotation.show = false;
					temporaryAnnotationHighlight?.els.forEach((h) => {
						h.removeHighlights();
					});
					temporaryAnnotationHighlight = undefined;
					currentAnnotation.set({
						show: false
					});
				}}
				on:save={(e) => {
					currentAnnotation.set({
						show: false
					});
					console.log({ e });
					if (e.detail) {
						console.log(e.detail);
						const selector = `[data-sidebar-annotation-id="${e.detail.form?.data.id}"]`;
						console.log({ selector });
						elementReady(selector).then((el) => {
							console.log({ el });
							if (el) {
								el.scrollIntoView({
									behavior: 'smooth',
									block: 'center'
								});
							}
						});
					}
				}}
				data={data.annotationForm}
			/> -->
		</div>
	</div>
{/if}

<div class="prose prose-stone dark:prose-invert mx-auto prose-pre:text-balance">
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

</style>
