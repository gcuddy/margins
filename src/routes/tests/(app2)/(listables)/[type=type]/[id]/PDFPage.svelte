<script lang="ts">
	import inView from '$lib/actions/inview';
	import type { PDFPageProxy, PageViewport, RenderTask } from 'pdfjs-dist';
	import { createEventDispatcher, onMount } from 'svelte';

	export let page: PDFPageProxy;
	export let scale: number;
	export let canvas: HTMLCanvasElement;

	let viewport: PageViewport;

	export const pageNumber = () => page.pageNumber;

	let renderTask: RenderTask | null = null;

	const dispatch = createEventDispatcher();

	export function drawPage() {
		if (renderTask) return;
		const canvasContext = canvas.getContext('2d');
		if (!canvasContext) return;
		renderTask = page.render({
			canvasContext,
			viewport
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

	const destroyRenderTask = () => {
		if (!renderTask) return;
		renderTask.cancel();
		renderTask = null;
	};

	onMount(() => {
		viewport = page.getViewport({ scale });
	});
</script>

<div
	use:inView
	on:exit={() => {
		destroyPage();
	}}
	on:enter={() => {
		drawPage();
	}}
	id="container"
>
	{#key scale}
		<svg
			style:width="{(viewport?.width * scale) / viewport_scale}px"
			style:height="{(viewport?.height * scale) / viewport_scale}px"
			id="svg-layer"
			class="absolute inset-0 h-full w-full overflow-hidden mix-blend-multiply"
		>
			{#each highlights.filter((h) => h.pageNumber === currentPage) as highlight}
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
	<canvas bind:this={canvas} id="pdf-canvas" />
</div>
