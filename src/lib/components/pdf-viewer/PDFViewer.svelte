<script lang="ts">
	import { getContext, onMount, tick } from 'svelte';
	import * as pdfjs from 'pdfjs-dist';
	import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.js?url';
	// import downloadsvg from './images/toolbarDownload.svg?url';
	// import printsvg from './images/toolbarPrint.svg?url';
	// import zoominsvg from './images/toolbarZoomIn.svg?url';
	// import zoomoutsvg from './images/toolbarZoomOut.svg?url';
	// import spreadsvg from './images/toolbarPageView.svg?url';
	// import gapsvg from './images/toolbarPageGap.svg?url';
	import './pdfviewer.css';
	import { ZoomInIcon } from 'lucide-svelte';
	import { nanoid } from 'nanoid';
	import {
		createTextPositionSelectorMatcher,
		createTextQuoteSelectorMatcher,
		describeTextPosition,
		describeTextQuote
	} from '$lib/annotator';
	import type { TargetSchema } from '$lib/annotation';
	import type { PDFDocumentProxy } from 'pdfjs-dist';
	import type { TextPositionSelector, TextQuoteSelector } from '$lib/annotator/types';
	import { highlightText } from '$lib/annotator/highlighter';
	import { getTargetSelector } from '$lib/utils/annotations';
	import Button from '$components/Button.svelte';
	import type { Annotation } from '@prisma/client';
	import { writable, type Writable } from 'svelte/store';
	import trackScroll from '$lib/actions/trackScroll';
	import { getPdfStateContext } from './utils';

	export let annotations: Pick<Annotation, 'id' | 'target'>[] = [];

	pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

	export let url: string | URL; //url of pdf.
	const INTERNAL_URL = url.toString();

	let classname = ''; //allows component to recieve classes
	export { classname as class };

	let styles = ''; //allows component to recieve classes
	export { styles as style };

    const pdf_state = getPdfStateContext();
    $: opts = $pdf_state.opts

	const MIN_SCALE = 0.5;
	const MAX_SCALE = 2.3;

	export let scrollingDown = (getContext('scrollingDown') as Writable<boolean>) ?? writable(false);
	$: console.log({ $scrollingDown });

	enum SpreadModes { //init display modes.
		'NONE',
		'ODD',
		'EVEN'
	}
	export let display_mode = '';
	let _spread_mode = SpreadModes.NONE;
	if (display_mode in SpreadModes) {
		_spread_mode = SpreadModes[display_mode as 'NONE' | 'ODD' | 'EVEN'];
	}

	//internal variables.
	let component_container: HTMLDivElement;
	let container: HTMLDivElement;
	let password = '';
	let password_error = false;
	let password_message = '';
	let _prev_gap_top = '8px';
	let _prev_gap_bottom = '8px';
	let pdf_document: PDFDocumentProxy;

	//Init button handlers (some require hydration on mount)
	let onPasswordSubmit: () => void;
	let onPageDisplay: () => void;

	async function highlightSelectorTarget(
		selector: TextQuoteSelector | TextPositionSelector,
		attrs?: Record<string, string>
	) {
		console.log(`highlightSelectorTarget`, { selector });
		let matches: AsyncGenerator<Range, void, void>;
		if (selector.type === 'TextQuoteSelector') {
			// REVIEW: should these be moved to the PdfPage component?
			matches = createTextQuoteSelectorMatcher(selector)(container);
		} else {
			matches = createTextPositionSelectorMatcher(selector)(container);
		}
		console.log({ matches });

		// Modifying the DOM while searching can mess up; see issue #112.
		// Therefore, we first collect all matches before highlighting them.
		const matchList = [];
		for await (const match of matches) matchList.push(match);

		return matchList.map((match) => highlightText(match, 'mark', attrs));
	}

	async function highlight() {
		const range = window.getSelection()?.getRangeAt(0);
		if (!range || range.collapsed) return;
		const text_quote_selector = await describeTextQuote(range, container);
		const text_position_selector = describeTextPosition(range, container);

		const page_num = Number(
			//@ts-expect-errors
			range.startContainer.parentElement?.closest(`[data-page-number]`)?.dataset?.pageNumber || 0
		);
		const target: TargetSchema = {
			source: `pdf:${pdf_document.fingerprints[0]}`,
			page_num,
			selector: [text_quote_selector, text_position_selector]
		};

		const id = nanoid();
		const h = await highlightSelectorTarget(text_quote_selector, {
			'data-annotation-id': id
		});

		// TODO: calculate x,y,w,h of highlight and store it in the annotation

		console.log({ h });

		// if (target.page_num) {
		// 	pdfPages[target.page_num - 1]?.addHighlight({
		// 		highlightElements: h.flatMap((h) => h.highlightElements),
		// 		id,
		// 		pageNumber: page_num,
		// 		removeHighlights: () => h.map((h) => h.removeHighlights())
		// 	});
		// 	// pdfPageHighlights[target.page_num - 1] = [
		// 	//     ...pdfPageHighlights[target.page_num],
		// 	//     {
		// 	//         highlightElements: h.flatMap((h) => h.highlightElements),
		// 	//         id,
		// 	//         pageNumber: page_num
		// 	//     }
		// 	// ];
		// }

		// highlights = [
		// 	...highlights,
		// 	{
		// 		highlightElements: h.flatMap((h) => h.highlightElements).map(calculate_h),
		// 		pageNumber: currentPage,
		// 		id
		// 	}
		// ];

		window.getSelection()?.removeAllRanges();

		return {
			...target,
			h
		};
	}

	async function render_annotations(pageNum: number) {
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
			if (page_num !== pageNum) continue;

			// check if the annotation element already exists
			const existing = container.querySelector(`[data-annotation-id="${annotation.id}"]`);
			if (existing) continue;
			const h = await highlightSelectorTarget(text_quote_selector, {
				'data-annotation-id': annotation.id
			});
		}
	}

	const printPdf = (url: string) => {
		const iframe = document.createElement('iframe');
		document.body.appendChild(iframe);

		iframe.style.display = 'none';
		iframe.onload = function () {
			setTimeout(function () {
				iframe.focus();
				iframe.contentWindow?.print();
			}, 1);
		};

		iframe.src = url;
	};

	const onPageGap = () => {
		const pages = component_container.getElementsByClassName('page');
		if (pages.length === 0) {
			return;
		}
		const current_styles = getComputedStyle(pages[0] as HTMLDivElement);
		const current_gap_bottom = current_styles.marginBottom;
		const current_gap_top = current_styles.marginTop;
		for (const page of pages) {
			(page as HTMLDivElement).style.marginBottom = _prev_gap_bottom;
			(page as HTMLDivElement).style.marginTop = _prev_gap_top;
		}
		_prev_gap_bottom = current_gap_bottom;
		_prev_gap_top = current_gap_top;
	};

	onMount(() => {
		if (['static', 'initial'].includes(getComputedStyle(component_container).position)) {
			console.warn('PdfViewer sizing only works when it is positioned (not static).');
		}
		const init_promise = import('pdfjs-dist/web/pdf_viewer.js').then((pdfjs_viewer) => {
			const event_bus = new pdfjs_viewer.EventBus();

			// (Optionally) enable hyperlinks within PDF files.
			const pdf_link_service = new pdfjs_viewer.PDFLinkService({
				eventBus: event_bus
			});

			event_bus.on('pagerendered', ({ pageNumber }: { pageNumber: number }) => {
				render_annotations(pageNumber);
				// can use this to render SVG highlights (we use our annotator to highlight textlayer, and then attach svgs to those elements)
				// console.log(`pagerendered`, e);
			});

			// (Optionally) enable find controller.
			const pdf_find_controller = new pdfjs_viewer.PDFFindController({
				eventBus: event_bus,
				linkService: pdf_link_service
			});
			const pdf_viewer = new pdfjs_viewer.PDFViewer({
				container,
				eventBus: event_bus,
				linkService: pdf_link_service,
				findController: pdf_find_controller,
				l10n: pdfjs_viewer.NullL10n
			});
            $pdf_state.pdf_viewer = pdf_viewer;
			pdf_link_service.setViewer(pdf_viewer);
			return { pdf_viewer, pdf_link_service };
		});

		const renderDocument = async () => {
			const { pdf_viewer, pdf_link_service } = await init_promise;
			// Loading document.
			const loading_task = pdfjs.getDocument({
				url,
				password,
				isEvalSupported: false
			});
			loading_task.promise
				.then((_pdf_document) => {
					pdf_document = _pdf_document;
					pdf_viewer.setDocument(pdf_document);
					pdf_link_service.setDocument(pdf_document, null);
                    // pdf_viewer.currentScaleValue = "page-width";
                    console.log({pdf_viewer})
                    // if (typeof $opts.scale === 'number') {
                    //     pdf_viewer.currentScale = $opts.scale;
                    // } else {
                    //     pdf_viewer.currentScaleValue = $opts.scale;
                    // }
					pdf_viewer.spreadMode = _spread_mode;
				})
				.catch(function (error) {
					password_error = true;
					password_message = error.message;
				});
			// onZoomOut = () => {
			// 	if (scale >= MIN_SCALE) {
			// 		scale = scale - 0.1;
			// 		pdf_viewer.currentScale = scale;
			// 	}
			// };
			onPageDisplay = () => {
				_spread_mode = (_spread_mode + 1) % 3;
				pdf_viewer.spreadMode = _spread_mode;
			};
			return pdf_viewer;
		};
		const render = renderDocument();

		onPasswordSubmit = () => {
			renderDocument();
		};

		return () => {
			render.then((pdf_viewer) => {
				pdf_viewer.cleanup();
			});
		};
	});

	function download(url: string) {
		const a = document.createElement('a');
		if (!a.click) {
			throw new Error('DownloadManager: "a.click()" is not supported.');
		}
		a.href = url;
		a.target = '_parent';
		// Use a.download if available. This increases the likelihood that
		// the file is downloaded instead of opened by another PDF plugin.
		if ('download' in a) {
			a.download = url.substring(url.lastIndexOf('/') + 1);
		}
		// <a> must be in the document for recent Firefox versions,
		// otherwise .click() is ignored.
		(document.body || document.documentElement).append(a);
		a.click();
		a.remove();
	}
</script>

<div class={classname} style={styles} bind:this={component_container}>
	<div id="viewer-parent" class="w-full h-full">
		{#if password_error === true}
			<div class="spdfinner">
				<p>This document requires a password to open:</p>
				<p>{password_message}</p>
				<div>
					<input type="password" bind:value={password} />
					<button on:click={onPasswordSubmit} class="password-button"> Submit </button>
				</div>
			</div>
		{:else}
			<div class="spdfinner">
				<div
					id="viewerContainer"
					use:trackScroll={{
						scrollingDown
					}}
					class="pt-[80px]"
					bind:this={container}
				>
					<div id="viewer" class="pdfViewer" />
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.spdfbanner {
		position: absolute;
		z-index: 10;
		top: 0px;
		height: 2.75rem;
		width: 100%;
		display: flex;
		justify-content: center;
		gap: 0.5rem;
		align-items: center;
		background-color: rgb(41 37 36);
		box-shadow: 1rem;
	}
	.spdfbutton {
		width: 25px;
	}
	.spdfinner {
		position: absolute;
		top: 0px;
		bottom: 0px;
		width: 100%;
	}
	.toolbarbutton:hover {
		background-color: rgb(87 83 78);
	}
	.toolbarbutton {
		border-radius: 2px;
		padding: 4px;
	}
</style>
