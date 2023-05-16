<script lang="ts">
	import { onMount, afterUpdate } from 'svelte';
	import {
		getDocument,
		PDFDocumentProxy,
		renderTextLayer,
		GlobalWorkerOptions,
		version
	} from 'pdfjs-dist';
	import type { PageData } from './$types';
	import Button from '$lib/components/ui/Button.svelte';
	import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-svelte';
	import Selection from './Selection.svelte';
	import { createTextQuoteSelectorMatcher, describeTextQuote } from '$lib/annotator';
	import type { TargetSchema } from '$lib/annotation';
	import { post } from '$lib/utils/forms';
	import { page } from '$app/stores';
	import type { TextQuoteSelector } from '$lib/annotator/types';
	import { highlightText } from '$lib/annotator/highlighter';
	import { nanoid } from '$lib/nanoid';
	export let data: PageData;

	GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.js`;

	let pdfDocument: PDFDocumentProxy;
	let currentPage = 1;
	let totalPages = 0;
	let canvas: HTMLCanvasElement;
	let wrapper: HTMLDivElement;
	let text_layer: HTMLDivElement;

	async function loadPDF() {
		if (!data?.entry?.uri) return;
		const pdf_path = data.S3_BUCKET_PREFIX + data.entry.uri;
		console.log({ pdf_path });
		// Load the PDF document
		const loadingTask = getDocument(pdf_path);
		pdfDocument = await loadingTask.promise;
		totalPages = pdfDocument.numPages;

		console.log(await pdfDocument.getMetadata());
		console.log(pdfDocument);
		// Render the initial page
		renderPage(currentPage);
	}

	onMount(async () => {
		// await import??
		loadPDF();
	});
	// afterUpdate(loadPDF);

	async function renderPage(pageNumber: number) {
		const page = await pdfDocument.getPage(pageNumber);
		const viewport = page.getViewport({ scale: 1.5 });
		const context = canvas.getContext('2d');
		if (!context) throw new Error('Could not get canvas context');
		canvas.height = viewport.height;
		canvas.width = viewport.width;

		const renderTask = page.render({ canvasContext: context, viewport });
		await renderTask.promise;

		const text_content = await page.getTextContent();
		renderTextLayer({
			textContentSource: {
				items: text_content.items,
				styles: text_content.styles
			},
			container: text_layer,
			viewport,
			textDivs: []
		});
	}

	function goToPreviousPage() {
		window.getSelection()?.removeAllRanges();
		if (currentPage > 1) {
			currentPage--;
			renderPage(currentPage);
		}
	}

	function goToNextPage() {
		window.getSelection()?.removeAllRanges();
		if (currentPage < totalPages) {
			currentPage++;
			renderPage(currentPage);
		}
	}

	// x={rect.left - wrapper_rect.left}
	// y={highlightElement.parentElement?.offsetTop}

	let highlights: {
		highlightElements: {
			element: HTMLElement;
			x?: number;
			y?: number;
			rect?: DOMRect;
		}[];
		pageNumber: number;
		id: string;
	}[] = [];

	async function highlight() {
		const range = window.getSelection()?.getRangeAt(0);
		if (!range || range.collapsed) return;
		const text_quote_selector = await describeTextQuote(range);

		const target: TargetSchema = {
			source: `pdf:${pdfDocument.fingerprints[0]}`,
			selector: [
				text_quote_selector,
				{
					pageNumber: currentPage,
					type: 'BookSelector'
				}
			]
		};

		const h = await highlightSelectorTarget(text_quote_selector);
		const id = nanoid();
		const wrapper_rect = wrapper.getBoundingClientRect();
		highlights = [
			...highlights,
			{
				highlightElements: h
					.flatMap((h) => h.highlightElements)
					.map((h) => {
						const rect = h.getBoundingClientRect();
						return {
							element: h,
							x: rect.left - wrapper_rect.left,
							y: h.parentElement?.offsetTop,
							rect
						};
					}),
				pageNumber: currentPage,
				id
			}
		];

		window.getSelection()?.removeAllRanges();

		return target;
	}

	async function highlightSelectorTarget(
		textQuoteSelector: TextQuoteSelector,
		attrs?: Record<string, string>
	) {
		const matches = createTextQuoteSelectorMatcher(textQuoteSelector)(wrapper!);

		// Modifying the DOM while searching can mess up; see issue #112.
		// Therefore, we first collect all matches before highlighting them.
		const matchList = [];
		for await (const match of matches) matchList.push(match);

		return matchList.map((match) => highlightText(match, 'mark', attrs));
		// for (const match of matchList) {
		// 	const el = highlightText(match)
		// };
	}

	$: wrapper_rect = wrapper?.getBoundingClientRect();
</script>

<!-- keyboard nav -->
<svelte:window
	on:keydown={(e) => {
		if (e.key === 'ArrowLeft') {
			e.preventDefault();
			goToPreviousPage();
		}
		if (e.key === 'ArrowRight') {
			e.preventDefault();
			goToNextPage();
		}
	}}
/>

<div class="fixed inset-x-0 bottom-8 z-50 mx-auto">
	<div
		class="inset-x-0 mx-auto flex w-52 items-center justify-center gap-x-4 rounded-md bg-popover/80 p-4 backdrop-blur-md"
	>
		<Button on:click={goToPreviousPage} disabled={currentPage === 1}>
			<ChevronLeftIcon size={16} />
			<span class="sr-only">Back</span>
		</Button>
		<Button on:click={goToNextPage} disabled={currentPage === totalPages}>
			<span class="sr-only">Next</span>
			<ChevronRightIcon size={16} />
		</Button>
	</div>
</div>

<Selection
	on:highlight={({ detail }) => {
		const { form, el } = detail;
		const target = highlight();
		if (!target) return;
	}}
/>

<div bind:this={wrapper} id="article" style="--scale-factor: 1.5;">
	<!-- floating toolbar -->
	<div class="relative">
		<svg id="svg-layer" class="absolute inset-0 h-full w-full overflow-hidden mix-blend-multiply">
			{#each highlights.filter((h) => h.pageNumber === currentPage) as highlight}
				{#each highlight.highlightElements as highlightElement}
					{#if highlightElement}
						<rect
							x={highlightElement.x}
							y={highlightElement.y}
							width={highlightElement.rect?.width}
							height={highlightElement.rect?.height}
							fill="rgba(255, 255, 0, 0.5)"
						/>
					{/if}
				{/each}
			{/each}
		</svg>
		<div class="absolute inset-0" bind:this={text_layer} id="text-layer" />
		<canvas bind:this={canvas} id="pdf-canvas" />
	</div>
</div>

<style>
	#text-layer {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		overflow: hidden;
	}
	#text-layer :global(::selection) {
		@apply bg-ring/20;
	}

	#text-layer :global(> div),
	#text-layer :global(> span) {
		position: absolute;
		color: transparent;
		white-space: pre;
		cursor: text;
		transform-origin: 0% 0%;
	}

	#text-layer :global(mark) {
		background-color: rgba(0, 0, 0, 0) !important;
		color: inherit !important;
	}
</style>
