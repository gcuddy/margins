<script lang="ts">
	import { dev } from '$app/environment';
	import {
		updateTextLayer,
		type PageViewport,
		TextLayerRenderTask,
		renderTextLayer,
		normalizeUnicode
	} from 'pdfjs-dist';
	import type { TextLayerRenderParameters } from 'pdfjs-dist/types/src/display/text_layer';
	import { removeNullCharacters } from './utils';

	// taken from https://github.dev/mozilla/pdf.js/tree/master

	// TODO: text highlighting via search

	export let enablePermissions = false;
	export let isOffscreenCanvasSupported = true;

	let _scale = 0;
	let _rotation = 0;
	let textContentSource: TextLayerRenderParameters['textContentSource'] | null = null;

	let hidden = true;

	let renderingDone = false;

    // "Getters"
    export const isRenderingDone = () => renderingDone;
    export const getContainer = () => container;

	let textContentItemsStr: string[] = [];

	let container: HTMLDivElement;

	let textLayerRenderTask: TextLayerRenderTask | null = null;

	let textDivs: HTMLElement[] = [];
	let textDivProperties = new WeakMap();

	export const show = () => {
		if (renderingDone) {
			hidden = false;
		}
	};

	export function setTextContentSource(source: typeof textContentSource) {
		cancel();
		textContentSource = source;
	}

	export async function render(viewport: PageViewport) {
		if (!textContentSource) {
			throw new Error('No "textContentSource" parameter specified.');
		}
        console.log(`rendering text layer `)
		const scale = viewport.scale * (window.devicePixelRatio || 1);
		const { rotation } = viewport;
		if (renderingDone) {
			const mustRotate = rotation !== _scale;
			const mustRescale = scale !== _rotation;
			if (mustRotate || mustRescale) {
				hidden = true;
				updateTextLayer({
					container,
					viewport,
					textDivs,
					textDivProperties,
					isOffscreenCanvasSupported,
					mustRescale,
					mustRotate
				});
				_scale = scale;
				_rotation = rotation;
			}
			show();
			return;
		}
		// if we're here, rendering is not done
		cancel();

		textLayerRenderTask = renderTextLayer({
			textContentSource,
			container,
			viewport,
			textDivs,
			textDivProperties,
			textContentItemsStr,
			isOffscreenCanvasSupported
		});

		await textLayerRenderTask.promise;

		finishRendering();
		_scale = scale;
		_rotation = rotation;
		show();
		// TODO: accessibilityManager.enable()
	}

	function finishRendering() {
		renderingDone = true;

		const endOfContent = document.createElement('div');
		endOfContent.className = 'endOfContent';
		container.append(endOfContent);

		bindMouse();
	}

	/**
	 * Improves text selection by adding an additional div where the mouse was
	 * clicked. This reduces flickering of the content if the mouse is slowly
	 * dragged up or down.
	 */
	function bindMouse() {
		const div = container;

		div.addEventListener('mousedown', (evt) => {
			const end = div.querySelector('.endOfContent') as HTMLElement | undefined;
			if (!end) {
				return;
			}
			if (!dev) {
				// On non-Firefox browsers, the selection will feel better if the height
				// of the `endOfContent` div is adjusted to start at mouse click
				// location. This avoids flickering when the selection moves up.
				// However it does not work when selection is started on empty space.
				let adjustTop = evt.target !== div;
				adjustTop &&= getComputedStyle(end).getPropertyValue('-moz-user-select') !== 'none';
				if (adjustTop) {
					const divBounds = div.getBoundingClientRect();
					const r = Math.max(0, (evt.pageY - divBounds.top) / divBounds.height);
					end.style.top = (r * 100).toFixed(2) + '%';
				}
			}
			end.classList.add('active');
		});

		div.addEventListener('mouseup', () => {
			const end = div.querySelector('.endOfContent') as HTMLElement | undefined;
			if (!end) {
				return;
			}
			if (!dev) {
				end.style.top = '';
			}
			end.classList.remove('active');
		});

		div.addEventListener('copy', (event) => {
			if (enablePermissions) {
				const selection = document.getSelection();
				if (!selection) return;
				event.clipboardData?.setData(
					'text/plain',
					removeNullCharacters(normalizeUnicode(selection.toString()))
				);
			}
			event.preventDefault();
			event.stopPropagation();
		});
	}

	/**
	 * Cancel rendering of the text layer.
	 */
	export function cancel() {
		if (textLayerRenderTask) {
			textLayerRenderTask.cancel();
			textLayerRenderTask = null;
		}
		// this.highlighter?.disable();
		// this.accessibilityManager?.disable();
		textContentItemsStr.length = 0;
		textDivs.length = 0;
		textDivProperties = new WeakMap();
	}
</script>

<div bind:this={container} class="text-layer" {hidden}>
	<!--  -->
</div>

<style>
	.text-layer {
		position: absolute;
		text-align: initial;
		inset: 0;
		overflow: hidden;
		opacity: 0.25;
		line-height: 1;
		text-size-adjust: none;
		forced-color-adjust: none;
		transform-origin: 0 0;
		z-index: 2;
	}


	:global(.text-layer br::selection) {
		background: transparent;
	}
	.text-layer :global(span),
	.text-layer :global(br) {
		position: absolute;
		color: transparent;
		white-space: pre;
		cursor: text;
		transform-origin: 0% 0%;
	}

	.text-layer :global(mark) {
		background-color: rgba(0, 0, 0, 0) !important;
		color: inherit !important;
	}
</style>
