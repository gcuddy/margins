<script lang="ts">
	import inView from '$lib/actions/inview';
	import { renderTextLayer } from 'pdfjs-dist';
	import type { PDFPageProxy, PageViewport, RenderTask } from 'pdfjs-dist';
	import { createEventDispatcher, onMount, tick } from 'svelte';
	import {
		createTextPositionSelectorMatcher,
		createTextQuoteSelectorMatcher,
		describeTextPosition,
		describeTextQuote
	} from '$lib/annotator';
	import { highlightText } from '$lib/annotator/highlighter';
	import type { TextPositionSelector, TextQuoteSelector } from '$lib/annotator/types';

	import type { TargetSchema } from '$lib/annotation';
	import { getTargetSelector } from '$lib/utils/annotations';

	export let page: PDFPageProxy;
	export let scale: number;
	let canvas: HTMLCanvasElement;
	import type { PageData } from './$types';
	export let annotations: NonNullable<NonNullable<PageData['entry']>['annotations']>;

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

	let viewport: PageViewport;

	$: actualSizeViewport = viewport?.clone({ scale });

	$: console.log({ viewport });

	export const pageNumber = () => page.pageNumber;

	let renderTask: RenderTask | null = null;
	let text_layer: HTMLElement;

	const dispatch = createEventDispatcher();

    const scales: Record<number, number> = {
		1: 3.2,
		2: 4
	};

	export async function drawPage() {
		if (renderTask) return;
		const canvasContext = canvas.getContext('2d');
		if (!canvasContext) return;
		renderTask = page.render({
			canvasContext,
			viewport
		});

		const text_content = await page.getTextContent();
		if (text_layer) text_layer.innerHTML = '';
		renderTextLayer({
			textContentSource: {
				items: text_content.items,
				styles: text_content.styles
			},
			container: text_layer,
			viewport,
			textDivs: []
		});

		renderTask.promise
			.then(() => {
				dispatch('rendered');
			})
			.catch((response) => {
				destroyRenderTask();
				dispatch('error', {
					response
				});
			});
	}

	function destroyPage() {
		if (page) page.cleanup();
		destroyRenderTask();
	}

	async function highlightSelectorTarget(
		selector: TextQuoteSelector | TextPositionSelector,
		attrs?: Record<string, string>
	) {
		let matches: AsyncGenerator<Range, void, void>;
		if (selector.type === 'TextQuoteSelector') {
			matches = createTextQuoteSelectorMatcher(selector)(text_layer!);
		} else {
			matches = createTextPositionSelectorMatcher(selector)(text_layer!);
		}

		// Modifying the DOM while searching can mess up; see issue #112.
		// Therefore, we first collect all matches before highlighting them.
		const matchList = [];
		for await (const match of matches) matchList.push(match);

		return matchList.map((match) => highlightText(match, 'mark', attrs));
		// for (const match of matchList) {
		// 	const el = highlightText(match)
		// };
	}

	async function renderAnnotations() {
		await tick();
		for (const annotation of annotations) {
			if (!annotation.target) continue;
			const page_num = (annotation.target as TargetSchema).page_num;
			const text_quote_selector = getTargetSelector(
				annotation.target as TargetSchema,
				'TextQuoteSelector'
			);
			const text_position_selector = getTargetSelector(
				annotation.target as TargetSchema,
				'TextPositionSelector'
			);
			// const page_selector = getTargetSelector(annotation.target as TargetSchema, 'BookSelector');
			if (!text_quote_selector || !page_num) continue;
			if (page_num !== page.pageNumber) continue;

			console.log({ text_position_selector });
			// check if annotation is already highlighted
			// if (highlights.some((h) => h.id === annotation.id)) continue;
			const h = await highlightSelectorTarget(text_quote_selector);
			console.log({ h, text_quote_selector });
			highlights = [
				...highlights
					// filter out this annotation
					.filter((h) => h.id !== annotation.id)
					// re-render all other annotations
					.map((h) => {
						return {
							...h,
							highlightElements: h.highlightElements.map(({ element }) => {
								return calculate_h(element);
							})
						};
					}),
				{
					highlightElements: h.flatMap((h) => h.highlightElements).map(calculate_h),
					pageNumber: page_num,
					id: annotation.id
				}
			];
		}
	}

	let wrapper: HTMLElement;

	const calculate_h = (h: HTMLElement) => {
		const rect = h.getBoundingClientRect();
		const wrapper_rect = wrapper.getBoundingClientRect();
		return {
			element: h,
			x: rect.left - wrapper_rect.left,
			y: h.parentElement?.offsetTop,
			rect
		};
	};

	const destroyRenderTask = () => {
		if (!renderTask) return;
		renderTask.cancel();
		renderTask = null;
	};

	const pixelRatio = window.devicePixelRatio || 1;

    $: _scale = scales[window.devicePixelRatio || 1] || scale;
	$: viewport = page.getViewport({ scale: _scale });

	$: style = {
		width: Math.ceil(actualSizeViewport?.width / pixelRatio || 0),
		height: Math.ceil(actualSizeViewport?.height / pixelRatio || 0)
	};
    $: ({pageHeight, pageWidth} = (viewport?.rawDims || {pageHeight: 0, pageWidth: 0}) as {pageHeight: number, pageWidth: number});
</script>

<div
	bind:this={wrapper}
	use:inView
	on:exit={() => {
		destroyPage();
	}}
	on:enter={() => {
		drawPage();
	}}
	id="container"
	class="relative"
    data-page-number={page.pageNumber}
    style:width="calc(var(--scale-factor) * {pageHeight})px"
    style:height="calc(var(--scale-factor) * {pageWidth})px"
    data-loaded={!!page}
>
	{#key scale}
		<svg
			style:width="{style.width}px"
			style:height="{style.height}px"
			id="svg-layer"
			class="absolute inset-0 h-full w-full overflow-hidden mix-blend-multiply"
		>
			{#each highlights.filter((h) => h.pageNumber === page.pageNumber) as highlight}
				{#each highlight.highlightElements as highlightElement}
					{@const parent = highlightElement.element.parentElement}
					{#if highlightElement && parent}
						<rect
							data-annotation-id={highlight.id}
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
	{/key}
    <!-- style:width="{style.width}px"
    style:height="{style.height}px" -->
	<div
		class="absolute inset-0"
		bind:this={text_layer}
		id="text-layer"
	/>
	<canvas
		width={Math.ceil(viewport?.width || 0)}
		height={Math.ceil(viewport?.height || 0)}
		style:width="{style.width}px"
		style:height="{style.height}px"
		bind:this={canvas}
		id="pdf-canvas"
	/>
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
