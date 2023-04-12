<script lang="ts">
	import Button from "$lib/components/ui/Button.svelte";
	import { H1, Subtle } from "$lib/components/ui/typography";
	import { getCurrentListContext } from "$lib/stores/currentList";
	import { EditIcon, Highlighter, LoaderIcon } from "lucide-svelte";
	import { fly, scale } from "svelte/transition";
	import { superForm } from "sveltekit-superforms/client";
	import type { PageData } from "./$types";

	import { browser } from "$app/environment";
	import {
		createTextQuoteSelectorMatcher,
		describeTextQuote,
	} from "$lib/annotator";
	import { highlightText } from "$lib/annotator/highlighter";
	import type { TextQuoteSelector } from "$lib/annotator/types";
	import { onDestroy, onMount } from "svelte";
	import { createPopperActions } from "svelte-popperjs";
	import { derived, writable } from "svelte/store";
	import AnnotationForm from "$lib/components/AnnotationForm.svelte";
	import { draggable } from "@neodrag/svelte";

	export let data: PageData;
	const currentList = getCurrentListContext();
	$: currentIndex = $currentList.entries.findIndex(
		(e) => e.id === data.entry.id
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

	let articleWrapper: HTMLElement | undefined = undefined;

	const clearSelection = () => window.getSelection()?.removeAllRanges();
	const highlight = async () => {
		const range = $selection?.getRangeAt(0);
		if (!range || range.collapsed) return;
		const selector = await describeTextQuote(range);
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
					class="flex h-auto flex-col space-y-1"
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
							showAnnotationForm = true;
						}
					}}
					variant="ghost"
					class="flex h-auto flex-col space-y-1"
				>
					<EditIcon class="h-5 w-5" />
					<Subtle class="text-xs">Annotate</Subtle>
				</Button>
			</div>
		</div>
	</div>
{/if}

{#if showAnnotationForm}
	<div use:annotationContent>
		<div
			in:scale={{
				duration: 200,
				start: 0.9,
			}}
			use:draggable
		>
			<AnnotationForm
				on:cancel={() => {
					showAnnotationForm = false;
					temporaryAnnotationHighlight?.forEach((h) => {
						h.removeHighlights();
					});
					temporaryAnnotationHighlight = undefined;
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

<div class="prose prose-slate dark:prose-invert">
	<H1>{data.entry.title}</H1>x
	<form action="?/bookmark" method="post" use:enhance>
		{#if data.entry.bookmark}
			<input type="hidden" value={data.entry.bookmark.id} name="id" />
		{/if}
		<Button disabled={$submitting}>
			<span>Bookmark</span>
			{#if $delayed}
				<div
					in:fly|local={{
						x: -10,
					}}
				>
					<LoaderIcon class="ml-2 h-4 w-4 animate-spin" />
				</div>
			{/if}
		</Button>
	</form>
	<!-- <Command>
		<CommandInput placeholder="Filter label..." />
		<CommandList>
			<CommandEmpty>No label found.</CommandEmpty>
			<CommandGroup>
				{#each labels as label (label)}
					<CommandItem
						onSelect={(value) => {
							//   setLabel(value)
							//   setOpen(false)
						}}
					>
						{label}
					</CommandItem>
				{/each}
			</CommandGroup>
		</CommandList>
	</Command> -->
	<!-- TODO: tag form -->
	Annotations: {data.entry.annotations.length}
	Collections: {data.entry.collections.length}
	Relations: {data.entry.relations.length}
	Bookmark: {JSON.stringify(data.entry.bookmark)}
	Tags: {JSON.stringify(data.entry.tags)}

	<div bind:this={articleWrapper} id="article" class="select-text">
		{@html data.entry.html}
	</div>
</div>
