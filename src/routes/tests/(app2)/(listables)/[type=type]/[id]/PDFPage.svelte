<script lang="ts">
	import inView from '$lib/actions/inview';
	import {
		renderTextLayer,
		PixelsPerInch,
		RenderingCancelledException,
		setLayerDimensions
	} from 'pdfjs-dist';
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
	let rotation = 0;
	let pdfPageRotate = 0;
	export let scrollTop: number;
	export let clientHeight: number;
	export let isFocused = false;

	export let useOnlyCssZoom = true;

	const MAX_CANVAS_PIXELS = 16777216;
	let hasRestrictedScaling = false;
	let elementTop = 0;
	let elementHeight = 0;

	let rendering_id = `page${page.pageNumber}`;

	let resume: null | (() => void) = null;

	let renderingState: RenderingState = RenderingStates.INITIAL;

	let outputScale: OutputScale | null = null;
	let viewportMap = new WeakMap();

	const renderingQueue = getRenderingQueueContext();

	const state = get_pdf_context();

	export async function draw() {
		if (renderingState !== RenderingStates.INITIAL) {
			console.error('Must be in new state before drawing');
			reset(); // Ensure that we reset all state to prevent issues.
		}
		if (!page) {
			// REVIEW: don't understand this - why are we setting to finished?
			renderingState = RenderingStates.FINISHED;
			throw new Error('pdfPage is not loaded');
		}
		renderingState = RenderingStates.RUNNING;
		// Wrap the canvas so that if it has a CSS transform for high DPI the
		// overflow will be hidden in Firefox.

		// TODO: AnnotationLayer / SVGLayer (AnnotationLayer is just svgs for us, see our implementaiton (similar to hypothes.is))

		const renderContinueCallback: RenderTask['onContinue'] = (cont: Function) => {
			console.log(`draw() - renderContinueCallback()`);
			showCanvas?.(false);
			if (renderingQueue && $renderingQueue.highestPriorityPage !== rendering_id) {
				renderingState = RenderingStates.PAUSED;
				resume = () => {
					renderingState = RenderingStates.RUNNING;
					cont();
				};
				return;
			}
			cont();
		};

		const { width, height } = viewport;
		console.log(`draw() - viewport - width: ${width}, height: ${height}`);
		canvas.hidden = true;
		// const hasHCM = !!(pageColors?.background && pageColors?.foreground);
		let showCanvas: null | ((b: boolean) => void) = (isLastShow: boolean) => {
			// In HCM, a final filter is applied on the canvas which means that
			// before it's applied we've normal colors. Consequently, to avoid to have
			// a final flash we just display it once all the drawing is done.
			if (/*!hasHCM || */ isLastShow) {
				canvas.hidden = false;
				showCanvas = null; // Only invoke the function once.
			}
		};

		const ctx = canvas.getContext('2d', { alpha: false });

		outputScale = new OutputScale();

		if (useOnlyCssZoom) {
			const actualSizeViewport = viewport.clone({
				scale: PixelsPerInch.PDF_TO_CSS_UNITS
			});
			// Use a scale that makes the canvas have the originally intended size
			// of the page.
			outputScale.sx *= actualSizeViewport.width / width;
			outputScale.sy *= actualSizeViewport.height / height;
		}

		const sfx = approximateFraction(outputScale.sx);
		const sfy = approximateFraction(outputScale.sy);

		canvas.width = roundToDivide(width * outputScale.sx, sfx[0]);
		canvas.height = roundToDivide(height * outputScale.sy, sfy[0]);

		const { style } = canvas;
        // TODO: this is where the problem is coming in to play
        console.log({width, sfx})
		style.width = roundToDivide(width, sfx[1]) + 'px';
		style.height = roundToDivide(height, sfy[1]) + 'px';

		// Add the viewport so it's known what it was originally drawn with.
		viewportMap.set(canvas, viewport);

		const transform = outputScale.scaled ? [outputScale.sx, 0, 0, outputScale.sy, 0, 0] : undefined;

		if (!ctx) {
			throw new Error('ctx is null');
		}
		const renderContext: RenderParameters = {
			canvasContext: ctx,
			transform,
			viewport
			// annotationMode: this.#annotationMode,
			// optionalContentConfigPromise: this._optionalContentConfigPromise,
			// annotationCanvasMap: this._annotationCanvasMap,
			// pageColors
		};

		console.log({ renderTask });
		renderTask = page.render(renderContext);
		console.log({ renderTask });
		// renderTask.onContinue = renderContinueCallback;

		console.log(`got here: rendering page ${page.pageNumber} at scale ${scale}`);
		console.log({ renderTask });
		const resultPromise = renderTask.promise.then(
			async () => {
				console.log(`draw() - renderTask.promise.then()`);
				showCanvas?.(true);
				await finishRenderTask(renderTask);

				console.log(`draw() - post renderTask.promise.then()`);

				render_text_layer();

				// if (this.annotationLayer) {
				// 	await this.#renderAnnotationLayer();
				// }

				// if (!this.annotationEditorLayer) {
				// 	const { annotationEditorUIManager } = this.#layerProperties();

				// 	if (!annotationEditorUIManager) {
				// 		return;
				// 	}
				// 	this.annotationEditorLayer = new AnnotationEditorLayerBuilder({
				// 		uiManager: annotationEditorUIManager,
				// 		pageDiv: div,
				// 		pdfPage,
				// 		l10n,
				// 		accessibilityManager: this._accessibilityManager,
				// 		annotationLayer: this.annotationLayer?.annotationLayer
				// 	});
				// }
				// this.#renderAnnotationEditorLayer();
			},
			(error) => {
				// When zooming with a `drawingDelay` set, avoid temporarily showing
				// a black canvas if rendering was cancelled before the `onContinue`-
				// callback had been invoked at least once.
				if (!(error instanceof RenderingCancelledException)) {
					showCanvas?.(true);
				}
				return finishRenderTask(renderTask, error);
			}
		);
		console.log({ resultPromise });

		// if (pdfPage.isPureXfa) {
		//   if (!this.xfaLayer) {
		//     const { annotationStorage, linkService } = this.#layerProperties();

		//     this.xfaLayer = new XfaLayerBuilder({
		//       pageDiv: div,
		//       pdfPage,
		//       annotationStorage,
		//       linkService,
		//     });
		//   } else if (this.xfaLayer.div) {
		//     // The xfa layer needs to stay on top.
		//     div.append(this.xfaLayer.div);
		//   }
		//   this.#renderXfaLayer();
		// }

		// div.setAttribute("data-loaded", true);

		dispatch('pagerender', { page });
		return resultPromise;
	}

	async function finishRenderTask(render_task: RenderTask | null, error: unknown = null) {
		// The renderTask may have been replaced by a new one, so only remove
		// the reference to the renderTask if it matches the one that is
		// triggering this callback.
		if (renderTask === render_task) {
			renderTask = null;
		}

		if (error instanceof RenderingCancelledException) {
			// this.#renderError = null;
			return;
		}
		// this.#renderError = error;

		renderingState = RenderingStates.FINISHED;
		// this._resetZoomLayer(/* removeFromDOM = */ true);

		// Ensure that the thumbnails won't become partially (or fully) blank,
		// for documents that contain interactive form elements.
		// this.#useThumbnailCanvas.regularAnnotations = !renderTask.separateAnnots;

		dispatch('pagerendered', {
			page
		});

		if (error) {
			throw error;
		}
	}

	/**
	 * PLEASE NOTE: Most likely you want to use the `this.reset()` method,
	 *              rather than calling this one directly.
	 */
	function cancelRendering({
		keepAnnotationLayer = false,
		keepAnnotationEditorLayer = false,
		keepXfaLayer = false,
		keepTextLayer = false,
		cancelExtraDelay = 0
	} = {}) {
		if (renderTask) {
			renderTask.cancel(cancelExtraDelay);
			renderTask = null;
		}
		resume = null;

		if (textLayer && (!keepTextLayer || !textLayer.getContainer())) {
			textLayer.cancel();
		}
		// if (this.structTreeLayer && !this.textLayer) {
		//   this.structTreeLayer = null;
		// }
		// if (
		//   this.annotationLayer &&
		//   (!keepAnnotationLayer || !this.annotationLayer.div)
		// ) {
		//   this.annotationLayer.cancel();
		//   this.annotationLayer = null;
		//   this._annotationCanvasMap = null;
		// }
		// if (
		//   this.annotationEditorLayer &&
		//   (!keepAnnotationEditorLayer || !this.annotationEditorLayer.div)
		// ) {
		//   this.annotationEditorLayer.cancel();
		//   this.annotationEditorLayer = null;
		// }
		// if (this.xfaLayer && (!keepXfaLayer || !this.xfaLayer.div)) {
		//   this.xfaLayer.cancel();
		//   this.xfaLayer = null;
		//   this._textHighlighter?.disable();
		// }
	}

	function reset({
		keepZoomLayer = false,
		keepAnnotationLayer = false,
		keepAnnotationEditorLayer = false,
		keepXfaLayer = false,
		keepTextLayer = false
	} = {}) {
		cancelRendering({
			keepAnnotationLayer,
			keepAnnotationEditorLayer,
			keepXfaLayer,
			keepTextLayer
		});
		renderingState = RenderingStates.INITIAL;

		const div = wrapper;
		if (!div) return;

		const childNodes = div.childNodes,
			zoomLayerNode = (keepZoomLayer && zoomLayer) || null,
			// annotationLayerNode = (keepAnnotationLayer && this.annotationLayer?.div) || null,
			// annotationEditorLayerNode =
			// 	(keepAnnotationEditorLayer && this.annotationEditorLayer?.div) || null,
			// xfaLayerNode = (keepXfaLayer && this.xfaLayer?.div) || null,
			textLayerNode = (keepTextLayer && textLayer?.getContainer()) || null;
		for (let i = childNodes.length - 1; i >= 0; i--) {
			const node = childNodes[i];
			switch (node) {
				case zoomLayerNode:
				// case annotationLayerNode:
				// case annotationEditorLayerNode:
				// case xfaLayerNode:
				case textLayerNode:
					continue;
			}
			node.remove();
		}

		// if (annotationLayerNode) {
		// 	// Hide the annotation layer until all elements are resized
		// 	// so they are not displayed on the already resized page.
		// 	this.annotationLayer.hide();
		// }
		// if (annotationEditorLayerNode) {
		// 	this.annotationEditorLayer.hide();
		// }
		// if (xfaLayerNode) {
		// 	// Hide the XFA layer until all elements are resized
		// 	// so they are not displayed on the already resized page.
		// 	this.xfaLayer.hide();
		// }
		if (textLayerNode) {
			textLayer.hide();
		}
		// this.structTreeLayer?.hide();

		if (!zoomLayerNode) {
			if (canvas) {
				viewportMap.delete(canvas);
				// Zeroing the width and height causes Firefox to release graphics
				// resources immediately, which can greatly reduce memory consumption.
				canvas.width = 0;
				canvas.height = 0;
				// REVIEW: should we deltee re-render canvas?
				// delete canvas;
			}
			_resetZoomLayer();
		}
	}

	function updateElementBounds() {
		if (!wrapper) return;
		elementTop = wrapper.offsetTop;
		elementHeight = wrapper.offsetHeight;
	}

	let old_scale = scale;
	let canvas: HTMLCanvasElement;
	let in_view = false;
	import type { PageData } from './$types';
	import Highlight from '../../../../../(app)/u:[username]/notebook/_Highlight.svelte';
	import TextLayer from '$components/pdf-viewer/TextLayer.svelte';
	import {
		OutputScale,
		RenderingState,
		RenderingStates,
		approximateFraction,
		roundToDivide
	} from '$components/pdf-viewer/utils';
	import { getRenderingQueueContext } from '$components/pdf-viewer/rendering-queue';
	import type { RenderParameters } from 'pdfjs-dist/types/src/display/api';
	import { get_pdf_context } from '$components/pdf-viewer/api';
	export let annotations: NonNullable<NonNullable<PageData['entry']>['annotations']>;

	let textLayer: TextLayer;
	type Highlight = {
		highlightElements: {
			element: HTMLElement;
			x?: number;
			y?: number;
			rect?: DOMRect;
		}[];
		pageNumber: number;
		id: string;
		removeHighlights: () => void;
	};
	export let highlights: Highlight[] = [];

	let viewport: PageViewport;

	$: if (scale !== old_scale) {
		console.log(`scale chagne`, { scale });
		// zooming = true;
	}

	$: pixelRatio = window.devicePixelRatio || 1;

	$: {
		const totalRotation = (rotation + pdfPageRotate) % 360;
		viewport = page.getViewport({
			scale: scale * PixelsPerInch.PDF_TO_CSS_UNITS,
			rotation: totalRotation
		});
        console.log(`Setting vieport`, {
            scale, rotation, viewport
        })
		setDimensions();
		reset();
	}

	$: if (viewport) {
		dispatch('viewport', viewport);
	}

	export const pageNumber = () => page.pageNumber;
	export const getViewport = () => viewport;
	export const getWidth = () => viewport?.width || 0;
	export const getScale = () => viewport?.scale || scale;

	let renderTask: RenderTask | null = null;
	let text_layer: HTMLElement;

	let zoomLayer: HTMLElement | null = null;

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

		// renderTextLayer({
		// 	textContentSource: {
		// 		items: text_content.items,
		// 		styles: text_content.styles
		// 	},
		// 	container: text_layer,
		// 	viewport,
		// 	textDivs: []
		// });

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

	let previousRotation: number | null = null;

	function setDimensions() {
		if (page) {
			if (previousRotation && previousRotation === viewport.rotation) {
				return;
			}
			previousRotation = viewport.rotation;
		}
		if (wrapper) {
			setLayerDimensions(wrapper, viewport, /* mustFlip = */ true, /* mustRotate = */ false);
		}
	}

	function update(opts: { scale: number; rotation?: number; drawingDelay?: number }) {
		scale = opts.scale || scale;

		if (opts.rotation) {
			rotation = opts.rotation; // The rotation may be zero.
		}
		// this.#useThumbnailCanvas.directDrawing = true;

		const totalRotation = (rotation + pdfPageRotate) % 360;
		viewport = viewport.clone({
			scale: scale * PixelsPerInch.PDF_TO_CSS_UNITS,
			rotation: totalRotation
		});
		setDimensions();

		// if ((typeof PDFJSDev === 'undefined' || PDFJSDev.test('GENERIC')) && this._isStandalone) {
		// TODO: container (maybe in options store)
		// TODO: this should probably be an event (?) or it's something that gets passed from child to parent somehow
		// wrapper?.parentElement?.style.setProperty('--scale-factor', viewport.scale.toString());
		$state.scale = viewport.scale;
		// }

		let isScalingRestricted = false;
		if (
			canvas &&
			MAX_CANVAS_PIXELS > 0 &&
			/*REVIEW: this could probably be made non-nullable */ outputScale
		) {
			const { width, height } = viewport;
			const { sx, sy } = outputScale;
			if (((Math.floor(width) * sx) | 0) * ((Math.floor(height) * sy) | 0) > MAX_CANVAS_PIXELS) {
				isScalingRestricted = true;
			}
		}
		const onlyCssZoom = useOnlyCssZoom || (hasRestrictedScaling && isScalingRestricted);
		const drawingDelay = opts.drawingDelay || -1;
		const postponeDrawing = !onlyCssZoom && drawingDelay >= 0 && drawingDelay < 1000;

		if (canvas) {
			if (postponeDrawing || onlyCssZoom) {
				if (postponeDrawing && renderingState !== RenderingStates.FINISHED) {
					cancelRendering({
						// keepZoomLayer: true,
						keepAnnotationLayer: true,
						keepAnnotationEditorLayer: true,
						keepXfaLayer: true,
						keepTextLayer: true,
						cancelExtraDelay: drawingDelay
					});
					// It isn't really finished, but once we have finished
					// to postpone, we'll call this.reset(...) which will set
					// the rendering state to INITIAL, hence the next call to
					// PDFViewer.update() will trigger a redraw (if it's mandatory).
					renderingState = RenderingStates.FINISHED;
					// Ensure that the thumbnails won't become partially (or fully) blank,
					// if the sidebar is opened before the actual rendering is done.
					// TODO: this.#useThumbnailCanvas.directDrawing = false;
				}

				cssTransform({
					target: canvas,
					redrawAnnotationLayer: true,
					redrawAnnotationEditorLayer: true,
					redrawXfaLayer: true,
					redrawTextLayer: !postponeDrawing,
					hideTextLayer: postponeDrawing
				});

				if (postponeDrawing) {
					// The "pagerendered"-event will be dispatched once the actual
					// rendering is done, hence don't dispatch it here as well.
					return;
				}

				dispatch('pagerendered', { page });
				return;
			}
			if (!zoomLayer && !canvas.hidden) {
				zoomLayer = canvas.parentElement;
				if (zoomLayer) zoomLayer.style.position = 'absolute';
			}
		}

		// TODO 2023-07-21: zoom layer stuff
		if (zoomLayer && zoomLayer.firstChild instanceof HTMLCanvasElement) {
			cssTransform({ target: zoomLayer.firstChild });
		}
		reset({
			keepZoomLayer: true,
			keepAnnotationLayer: true,
			keepAnnotationEditorLayer: true,
			keepXfaLayer: true,
			keepTextLayer: true
		});
	}

	function _resetZoomLayer(removeFromDOM = false) {
		if (!zoomLayer) {
			return;
		}
		const zoomLayerCanvas = zoomLayer.firstChild;
		if (!(zoomLayerCanvas instanceof HTMLCanvasElement)) return;
		viewportMap.delete(zoomLayerCanvas);
		// Zeroing the width and height causes Firefox to release graphics
		// resources immediately, which can greatly reduce memory consumption.
		zoomLayerCanvas.width = 0;
		zoomLayerCanvas.height = 0;

		if (removeFromDOM) {
			// Note: `ChildNode.remove` doesn't throw if the parent node is undefined.
			zoomLayer.remove();
		}
		zoomLayer = null;
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

	export function addHighlight(
		highlight: Omit<Highlight, 'highlightElements'> & { highlightElements: HTMLElement[] }
	) {
		highlights = [
			...highlights,
			{
				...highlight,
				highlightElements: highlight.highlightElements.map((h) => calculate_h(h))
			}
		];
	}

	export async function renderAnnotations() {
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

	$: pdfAnnotations = page?.getAnnotations().then((annotations) => {
		if (annotations?.length) console.log({ annotations });
	});

	let wrapper: HTMLDivElement | undefined = undefined;
	export { wrapper as ref };

	const calculate_h = (h: HTMLElement) => {
		const rect = h.getBoundingClientRect();
		const wrapper_rect = wrapper?.getBoundingClientRect();
		return {
			element: h,
			x: rect.left - (wrapper_rect?.left || 0),
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

	$: canvasScaleRatio = scale * pixelRatio;
	$: if (scale !== old_scale) {
		// drawPage();
		// const canvasContext = canvas.getContext('2d');
		// // clear canvas
		// if (canvasContext && !renderTask) {
		//     // destroyRenderTask();
		// 	renderTask = page.render({
		// 		canvasContext,
		// 		viewport
		// 	});
		//     renderTask.promise.then(() => {
		//         destroyRenderTask();
		//     })
		// }
		// console.log('yeah');
	}

	// read-only
	export let scale_to_fit = 1;
	// $: scale_to_fit = (wrapper?.parentElement?.offsetWidth || 0) / pageHeight;
	$: console.log({ scale_to_fit });

	export let zooming = false;

	/**
	 *  Scale target (canvas), its wrapper and page container.
	 */
	function cssTransform({
		target = canvas,
		redrawAnnotationLayer = false,
		redrawAnnotationEditorLayer = false,
		redrawXfaLayer = false,
		redrawTextLayer = false,
		hideTextLayer = false
	}: {
		target?: HTMLCanvasElement;
		redrawAnnotationLayer?: boolean;
		redrawAnnotationEditorLayer?: boolean;
		redrawXfaLayer?: boolean;
		redrawTextLayer?: boolean;
		hideTextLayer?: boolean;
	}) {
		if (
			// (typeof PDFJSDev === 'undefined' || PDFJSDev.test('TESTING')) &&
			!(target instanceof HTMLCanvasElement)
		) {
			throw new Error('Expected `target` to be a canvas.');
		}
		if (!target.hasAttribute('zooming')) {
			target.setAttribute('zooming', 'true');
			const { style } = target;
			style.width = style.height = '';
		}

		const originalViewport = viewportMap.get(target) as typeof viewport;

		if (viewport !== originalViewport) {
			// The canvas may have been originally rotated; rotate relative to that.
			const relativeRotation = viewport.rotation - originalViewport.rotation;
			const absRotation = Math.abs(relativeRotation);
			let scaleX = 1,
				scaleY = 1;
			if (absRotation === 90 || absRotation === 270) {
				const { width, height } = viewport;
				// Scale x and y because of the rotation.
				scaleX = height / width;
				scaleY = width / height;
			}
			target.style.transform = `rotate(${relativeRotation}deg) scale(${scaleX}, ${scaleY})`;
		}

		//     if (redrawAnnotationLayer && this.annotationLayer) {
		//   this.#renderAnnotationLayer();
		// }
		// if (redrawAnnotationEditorLayer && this.annotationEditorLayer) {
		//   this.#renderAnnotationEditorLayer();
		// }
		// if (redrawXfaLayer && this.xfaLayer) {
		//   this.#renderXfaLayer();
		// }

		if (textLayer) {
			if (hideTextLayer) {
				textLayer.hide();
				//  TODO: Struct Tree is an accessibility feature that would be nice to have
				// this.structTreeLayer?.hide();
			} else if (redrawTextLayer) {
				render_text_layer();
			}
		}
	}

	function isElementFocused() {
		if (!elementHeight) return;
		const halfHeight = elementHeight / 2;
		const halfScreen = clientHeight / 2;
		const delta = elementHeight >= halfScreen ? halfScreen : halfHeight;
		const threshold = scrollTop + delta;
		const elementBottom = elementTop + elementHeight;
		const focused = elementTop < threshold && elementBottom >= threshold;
		if (focused && focused !== isFocused) {
			dispatch('focused', page.pageNumber);
		}
		isFocused = focused;
		return isFocused;
	}
	// $: scrollTop, isElementFocused();

	async function render_text_layer() {
		console.log(`render_text_layer()`);
		if (!textLayer) return;

		try {
			if (!textLayer.isRenderingDone()) {
				const readableStream = page.streamTextContent({
					includeMarkedContent: true,
					disableNormalization: true
				});
				textLayer.setTextContentSource(readableStream);
				await textLayer.render(viewport);
			}
		} catch (ex) {
			console.error(`#renderTextLayer: "${ex}".`);
		}
	}
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
		console.log(`drawing`);
		draw()
			.finally(() => {
				console.log(`draw() - finally`);
			})
			.catch((reason) => {
				if (reason instanceof RenderingCancelledException) {
					return;
				}
				console.error(`renderView: "${reason}"`);
			});
		// drawPage();
	}}
	on:progress={(e) => console.log('progress', { e })}
	id="container"
	class="relative my-0 mx-auto"
	data-page-number={page.pageNumber}
	style:width="calc(var(--scale-factor) * {pageWidth}px)"
	style:height="calc(var(--scale-factor) * {pageHeight}px)"
	data-loaded={!!page && renderingState === RenderingStates.FINISHED ? 'true' : undefined}
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

	<!-- <div class="absolute inset-0" bind:this={text_layer} id="text-layer" /> -->
	<TextLayer bind:this={textLayer} />

	<!-- CanvasWrapper -->
	<div class="h-full w-full overflow-hidden z-[1]">
		<!-- style:zoom="var(--scale-factor)" -->
		<!-- width={Math.ceil(pageWidth * canvasScaleRatio)}
        height={Math.ceil(pageHeight * canvasScaleRatio)} -->
		<!-- style:width={zooming ? '' : `${pageWidth}px`}
        style:height={zooming ? '' : `${pageHeight}px`}
        style:transform={zooming ? `scale(${scale})` : ''}
        style:zoom="var(--scale-factor)" -->
		<canvas
			class="block m-0"
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
	/* #text-layer :global(::selection) {
		@apply bg-ring/20;
	} */

	canvas[data-zooming] {
		width: 100%;
		height: 100%;
	}
</style>
