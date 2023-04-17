<script lang="ts">
	import Button from "$lib/components/ui/Button.svelte";
	import { H1, Subtle } from "$lib/components/ui/typography";
	import { getCurrentListContext } from "$lib/stores/currentList";
	import { EditIcon, Highlighter } from "lucide-svelte";
	import { scale } from "svelte/transition";
	import { superForm } from "sveltekit-superforms/client";
	import type { PageData } from "./$types";

	import { browser } from "$app/environment";
	import type { Annotation } from "$lib/annotation";
	import {
		createTextQuoteSelectorMatcher,
		describeTextQuote,
	} from "$lib/annotator";
	import { highlightText } from "$lib/annotator/highlighter";
	import type { TextQuoteSelector } from "$lib/annotator/types";
	import AnnotationForm from "$lib/components/AnnotationForm.svelte";
	import { onDestroy, onMount, tick } from "svelte";
	import { createPopperActions } from "svelte-popperjs";
	import { derived, writable } from "svelte/store";
	import Book from "./Book.svelte";
	import BookmarkForm from "./BookmarkForm.svelte";
	import Movie from "./Movie.svelte";
	import Podcast from "./Podcast.svelte";
	import Tv from "./TV.svelte";

	export let data: PageData;
	$: ({ type } = data);
	const currentList = getCurrentListContext();
	$: currentIndex = $currentList.entries.findIndex(
		(e) => e.id === data.entry?.id
	);
	$: nextId = $currentList.entries[currentIndex + 1]?.id;
	$: prevId = $currentList.entries[currentIndex - 1]?.id;

	$: ({ hasMore } = currentList);

	const { form, enhance, submitting, delayed } = superForm(data.bookmarkForm);

	const selection = writable<Selection | null>(null);

	const showAnnotationTooltip = derived(selection, ($selection) => {
		if (!$selection || !$selection.rangeCount || $selection.isCollapsed)
			return false;
		const range = $selection.getRangeAt(0);
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
						right: 0,
					} as DOMRect),
			};
		const range = $selection.getRangeAt(0);
		return {
			getBoundingClientRect: () => range.getBoundingClientRect(),
		};
	});

	function handleSelect(e: Event) {
		if (data.type !== "article") return;
		const fn = () => {
			selection.set(window.getSelection());
		};
		requestAnimationFrame(fn);
	}
	const [popperRef, popperContent] = createPopperActions({
		strategy: "fixed",
		modifiers: [
			{
				name: "offset",
				options: {
					offset: [0, 12],
				},
			},
		],
	});
	const [annotationRef, annotationContent] = createPopperActions({
		modifiers: [
			{
				name: "offset",
				options: {
					offset: [0, 12],
				},
			},
		],
	});

	let articleWrapper: HTMLElement | undefined = undefined;

	const clearSelection = () => window.getSelection()?.removeAllRanges();
	const highlight = async () => {
		const range = $selection?.getRangeAt(0);
		if (!range || range.collapsed) return;
		const selector = await describeTextQuote(range);
		$currentAnnotation.annotation = {
			...$currentAnnotation.annotation,
			target: {
				selector,
				source: "",
			},
		};
		console.log({ selector, $currentAnnotation });
		const els = await highlightSelectorTarget(selector);
		return els;
	};

	async function highlightSelectorTarget(textQuoteSelector: TextQuoteSelector) {
		const matches = createTextQuoteSelectorMatcher(textQuoteSelector)(
			articleWrapper!
		);

		// Modifying the DOM while searching can mess up; see issue #112.
		// Therefore, we first collect all matches before highlighting them.
		const matchList = [];
		for await (const match of matches) matchList.push(match);

		return matchList.map((match) => highlightText(match));
		// for (const match of matchList) {
		// 	const el = highlightText(match)
		// };
	}

	popperRef(virtualEl);

	function debounce(delay: number) {
		let timeout: number | undefined = undefined;
		return (fn: () => void) => {
			if (timeout) clearTimeout(timeout);
			timeout = setTimeout(fn, delay) as unknown as number;
		};
	}

	const scrolling = writable(false);

	function handleScroll() {
		scrolling.set(true);
		debounce(100)(() => {
			scrolling.set(false);
		});
	}

	const mouseDown = writable(false);

	onMount(() => {
		if (browser) {
			document.addEventListener("selectionchange", handleSelect);
			document.addEventListener("scroll", handleScroll, { passive: true });
			document.addEventListener("mousedown", () => mouseDown.set(true));
			document.addEventListener("mouseup", () => mouseDown.set(false));
		}
	});

	onDestroy(() => {
		if (browser) {
			document.removeEventListener("selectionchange", handleSelect);
			document.removeEventListener("scroll", handleScroll);
			document.removeEventListener("mousedown", () => mouseDown.set(true));
			document.removeEventListener("mouseup", () => mouseDown.set(false));
		}
	});

	let showAnnotationForm = false;
	let temporaryAnnotationHighlight: Awaited<ReturnType<typeof highlight>> =
		undefined;
	const currentAnnotation = writable<{
		show: boolean;
		highlight?: Awaited<ReturnType<typeof highlight>>;
		annotation?: Partial<Annotation>;
	}>({
		show: false,
	});

	$: console.log({ $currentAnnotation });

	// Type Guards
	function isMovie(data: PageData): data is PageData & {
		movie: NonNullable<PageData["movie"]>;
		type: "movie";
	} {
		return data.type === "movie" && data.movie !== null;
	}

	function isBook(data: PageData): data is PageData & {
		book: NonNullable<PageData["book"]>;
		type: "book";
	} {
		return data.type === "book" && data.book !== null;
	}

	function isPodcast(data: PageData): data is PageData & {
		podcast: NonNullable<PageData["podcast"]>;
		type: "podcast";
	} {
		return data.type === "podcast" && data.podcast !== null;
	}

	function isTV(data: PageData): data is PageData & {
		tv: NonNullable<PageData["tv"]>;
		type: "tv";
	} {
		return data.type === "tv" && data.tv !== null;
	}
</script>

{#if $showAnnotationTooltip && $selection && !$scrolling}
	<!-- Note: should this be popover? Using some classes from shadcn/ui/hover card -->
	<div
		use:popperContent
		class="{$mouseDown
			? 'pointer-events-none'
			: 'pointer-events-auto-'} z-10 select-none"
	>
		<div
			class=" z-50 w-auto select-none rounded-md border border-slate-100 bg-white p-1 shadow-md outline-none dark:border-slate-800 dark:bg-slate-800"
			in:scale|local={{
				delay: 50,
				start: 0.9,
			}}
		>
			<div class="flex justify-between space-x-2">
				<Button
					on:pointerdown={async (e) => {
						if (!$selection) {
							clearSelection();
						}
						const els = await highlight();
						//TODO: determine first or last el based on screen position

						console.log({ els });
						clearSelection();
					}}
					class="flex h-auto flex-col space-y-1 dark:hover:bg-gray-700"
					variant="ghost"
				>
					<Highlighter class="h-5 w-5" />
					<Subtle class="text-xs">Highlight</Subtle>
				</Button>
				<Button
					on:pointerdown={async (e) => {
						// show annotation menu and grab annotation
						// clearSelection();
						const els = await highlight();
						clearSelection();
						if (els) {
							const el = els[0].highlightElements[0];
							temporaryAnnotationHighlight = els;
							annotationRef(el);
							tick().then(() => {
								showAnnotationForm = true;
								$currentAnnotation.show = true;
								$currentAnnotation.highlight = els;
							});
						}
					}}
					variant="ghost"
					class="flex h-auto flex-col space-y-1 dark:hover:bg-gray-700"
				>
					<EditIcon class="h-5 w-5" />
					<Subtle class="text-xs">Annotate</Subtle>
				</Button>
			</div>
		</div>
	</div>
{/if}

{#if $currentAnnotation.show && data.entry}
	<div use:annotationContent>
		<!-- use:draggable -->
		<div
			in:scale={{
				duration: 200,
				start: 0.9,
			}}
		>
			<AnnotationForm
				autofocus
				annotation={$currentAnnotation.annotation}
				entry={data.entry}
				on:cancel={() => {
					$currentAnnotation.show = false;
					temporaryAnnotationHighlight?.forEach((h) => {
						h.removeHighlights();
					});
					temporaryAnnotationHighlight = undefined;
					currentAnnotation.set({
						show: false,
					});
				}}
				on:save={() => {
					currentAnnotation.set({
						show: false,
					});
				}}
				data={data.annotationForm}
			/>
		</div>
	</div>
{/if}

<!-- lil arrows -->
{#if prevId || nextId}
	<div class="fixed right-4 top-4 flex flex-col">
		{#if prevId}
			<a href="/tests/entry/{prevId}">prev</a>
		{/if}

		{#if nextId}
			<a href="/tests/entry/{nextId}">next</a>
		{/if}
		{#if $hasMore && !nextId}
			<button on:click={currentList.fetch}> fetch more </button>
			{#if $currentList.loading}
				<span>loading...</span>
			{/if}
		{/if}
	</div>
{/if}

{#if type === "article"}
	<div class="prose prose-slate dark:prose-invert">
		<H1>{data.entry?.title}</H1>x
		<BookmarkForm data={data.bookmarkForm} />
		Annotations: {data.entry?.annotations?.length}
		Collections: {data.entry?.collections?.length}
		Relations: {data.entry?.relations?.length}
		Bookmark: {JSON.stringify(data.entry?.bookmark)}
		Tags: {JSON.stringify(data.entry?.tags)}

		<div bind:this={articleWrapper} id="article" class="select-text">
			{@html data.entry?.html}
		</div>
	</div>
{:else if isMovie(data)}
	<Movie {data} />
{:else if isBook(data)}
	<Book {data} />
{:else if isPodcast(data)}
	<Podcast {data} />
{:else if isTV(data)}
	<Tv {data} />
{/if}

<style lang="postcss">
	#article :global(mark) {
		@apply bg-yellow-100;
	}
	:global(.dark) #article :global(mark) {
		@apply bg-yellow-900/80 text-gray-50;
	}
</style>
