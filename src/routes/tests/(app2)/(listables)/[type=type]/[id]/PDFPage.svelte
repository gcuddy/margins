<script lang="ts">
	import inView from '$lib/actions/inview';
	import { renderTextLayer, PixelsPerInch } from 'pdfjs-dist';
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
	export let scrollTop: number;
	export let clientHeight: number;
	export let isFocused = false;
	let elementTop = 0;
	let elementHeight = 0;

	function updateElementBounds() {
		if (!wrapper) return;
		elementTop = wrapper.offsetTop;
		elementHeight = wrapper.offsetHeight;
	}

	let old_scale = scale;
	let canvas: HTMLCanvasElement;
	let in_view = false;
	import type { PageData } from './$types';
	export let annotations: NonNullable<NonNullable<PageData['entry']>['annotations']>;
	$: console.log({ PixelsPerInch });
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

	// $: if (scale !== old_scale) {
	//     old_scale = scale;
	//     console.log(`scale chagne`, { scale });
	//     viewport = page.getViewport({ scale });
	// }

	$: pixelRatio = window.devicePixelRatio || 1;

	$: viewport = page.getViewport({ scale: scale * pixelRatio });

	$: if (viewport) {
		dispatch('viewport', viewport);
	}

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
		await tick();
		if (renderTask) return;
		const canvasContext = canvas.getContext('2d');
		if (!canvasContext) return;
		console.log(`Rendering page ${page.pageNumber} at scale ${scale}`);
		viewport = page.getViewport({ scale: scale * pixelRatio });
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

		renderAnnotations();

		updateElementBounds();

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

	$: console.log({ viewport });
	$: ({ pageHeight, pageWidth } = (viewport?.rawDims || { pageHeight: 0, pageWidth: 0 }) as {
		pageHeight: number;
		pageWidth: number;
	});

	$: canvasScaleRatio = scale >= 1 ? scale * pixelRatio : 1;
	$: if (scale !== old_scale) {
		// drawPage();
		const canvasContext = canvas.getContext('2d');
		// clear canvas
		if (canvasContext) {
			page.render({
				canvasContext,
				viewport
			});
		}
		console.log('yeah');
	}

	// read-only
	export let scale_to_fit = 1;
	$: scale_to_fit = (wrapper?.parentElement?.offsetWidth || 0) / pageHeight;
	$: console.log({ scale_to_fit });

	let zooming = false;
	function cssTransform() {}

	function isElementFocused() {
		if (!elementHeight) return;
		const halfHeight = elementHeight / 2;
		const halfScreen = clientHeight / 2;
		const delta = elementHeight >= halfScreen ? halfScreen : halfHeight;
		const threshold = scrollTop + delta;
		const elementBottom = elementTop + elementHeight;
		const focused = elementTop < threshold && elementBottom >= threshold;
		if (focused && (focused !== isFocused)) {
			dispatch('focused', page.pageNumber);
		}
        isFocused = focused;
		return isFocused;
	}
	$: scrollTop, isElementFocused();
</script>

<div
	bind:this={wrapper}
	use:inView={{ progress: true }}
	on:exit={() => {
		in_view = false;
		destroyPage();
	}}
	on:enter={() => {
		in_view = true;
		drawPage();
	}}
	on:progress={(e) => console.log('progress', { e })}
	id="container"
	class="relative my-0 mx-auto"
	data-page-number={page.pageNumber}
	style:width="calc(var(--scale-factor) * {pageWidth}px)"
	style:height="calc(var(--scale-factor) * {pageHeight}px)"
	data-loaded={!!page}
>
	{#key scale}
		<svg
			style:width="calc(var(--scale-factor) * {pageWidth}px)"
			style:height="calc(var(--scale-factor) * {pageHeight}px)"
			id="svg-layer"
			class="absolute inset-0 mix-blend-multiply pointer-events-none z-[3]"
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

	<div class="absolute inset-0" bind:this={text_layer} id="text-layer" />

	<!-- CanvasWrapper -->
	<div>
		<canvas
			width={!zooming ? Math.ceil(pageWidth * canvasScaleRatio) : ''}
			height={!zooming ? Math.ceil(pageHeight * canvasScaleRatio) : ''}
			class="block m-0"
			style:width="{pageWidth}px"
			style:height="{pageHeight}px"
			style:zoom="var(--scale-factor)"
			data-zooming={zooming ? 'true' : undefined}
			bind:this={canvas}
			id="pdf-canvas"
		/>
		<!-- <canvas
		width={Math.round(viewport?.width * pixelRatio)}
        height={Math.round(viewport?.height * pixelRatio)}
        class="block m-0"
		style:width="{pageWidth}px"
		style:height="{pageHeight}px"
        style:zoom='var(--scale-factor)'
		bind:this={canvas}
		id="pdf-canvas"
	/> -->
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

	canvas[zooming] {
		width: 100%;
		height: 100%;
	}
</style>
