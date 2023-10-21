<script lang="ts">
	import { draggable } from '@neodrag/svelte';
	import debounce from 'just-debounce-it';
	import { forEach } from 'lodash';
	import throttle from 'lodash/throttle';
	import {
		ChevronLeftIcon,
		ChevronRightIcon,
		GroupIcon,
		MoreHorizontalIcon,
		TextSelectIcon,
		ZoomInIcon,
		ZoomOutIcon
	} from 'lucide-svelte';
	import {
		getDocument,
		GlobalWorkerOptions,
		type PageViewport,
		type PDFDocumentProxy,
		PDFWorker,
		PixelsPerInch,
		renderTextLayer,
		version	} from 'pdfjs-dist';
	import type { PDFPageProxy } from 'pdfjs-dist/types/src/display/api';
	import { type ComponentProps, getContext, onDestroy, onMount, tick } from 'svelte';
	import { get, Writable, writable } from 'svelte/store';
	import { type ContentAction,createPopperActions } from 'svelte-popperjs';
	import { toast } from 'svelte-sonner';

	import { browser } from '$app/environment';
	import { goto, invalidate, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import { pdf_context } from '$components/pdf-viewer/api';
	import { createRenderQueueContext } from '$components/pdf-viewer/rendering-queue';
	import Scroller from '$components/Scroller.svelte';
	import Editor from '$components/ui/editor/Editor.svelte';
	import Input from '$components/ui/input/input.svelte';
	import VirtualList from '$components/ui/internal/VirtualList.svelte';
	import NativeSelect from '$components/ui/NativeSelect.svelte';
	import { dialog_store } from '$components/ui/singletons/Dialog.svelte';
	import { Skeleton } from '$components/ui/skeleton';
	import PromptInput from '$components/ui/srs-card/PromptInput.svelte';
	import { clickOutside } from '$lib/actions/clickOutside';
	import resize from '$lib/actions/resize';
	import type { TargetSchema } from '$lib/annotation';
	import {
		createTextPositionSelectorMatcher,
		createTextQuoteSelectorMatcher,
		describeTextPosition,
		describeTextQuote
	} from '$lib/annotator';
	import { highlightText } from '$lib/annotator/highlighter';
	import type { TextPositionSelector, TextQuoteSelector } from '$lib/annotator/types';
	import { getCommanderContext } from '$lib/commands/GenericCommander.svelte';
	import JumpToEntry from '$lib/commands/JumpToEntry.svelte';
	import Button, { buttonVariants } from '$lib/components/ui/Button.svelte';
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuGroup,
		DropdownMenuItem,
		DropdownMenuSeparator,
		DropdownMenuTrigger
	} from '$lib/components/ui/dropdown-menu';
	import { nanoid } from '$lib/nanoid';
	import { mutation } from '$lib/queries/query';
	import { update_entry } from '$lib/state/entries';
	import { getTargetSelector } from '$lib/utils/annotations';
	import { post } from '$lib/utils/forms';
	import { build_toc, get_pdf_text } from '$lib/utils/pdf';
	import { cn } from '$lib/utils/tailwind';

	import { useCommanderContext } from '../../../Commander.svelte';
	import { useMenuBar } from '../../../MainNav.svelte';
	import { leftSidebarPortal } from '../LeftSidebar.svelte';
	import type { PageData } from './$types';
	import PdfPage from './PDFPage.svelte';
	import Selection from './Selection.svelte';

	export let data: PageData;

	$: annotations = data.entry?.annotations ?? [];

	let show_text_version = false;
	let text = '';
	let loading_text_version = false;

	GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.js`;

	let pdfDocument: PDFDocumentProxy;
	$: console.log({ pdfDocument, scale });

	let currentPage = data.entry?.interaction?.currentPage ?? 1;
	let totalPages = 0;
	let canvas: HTMLCanvasElement;
	let wrapper: HTMLDivElement;
	let text_layer: HTMLDivElement;
	let viewport: PageViewport;
	let container: HTMLElement;

	let pdfPages: Array<PdfPage> = [];
	let pdfPageElements: Array<HTMLDivElement> = [];
	let pdfPageHighlights: Array<NonNullable<ComponentProps<PdfPage>['highlights']>> = [];

	let thumbnails: Array<number> = [];
	let thumbnail_map = new Map<number, string>();

	let outline_container_height = 0;
	let leftSidebar: HTMLElement;
	let leftSidebarScrollTop = 0;
	let frame: number;

	let pages: Array<PDFPageProxy> = [];

	let labels: Array<string> = [];

	function poll() {
		if (leftSidebar.scrollTop !== leftSidebarScrollTop) {
			leftSidebarScrollTop = leftSidebar.scrollTop;
		}

		frame = requestAnimationFrame(poll);
	}

	async function make_thumbnail(page_num: number) {
		console.log(`Making thumbnail for page ${page_num}`);
		if (thumbnail_map.has(page_num)) {
			return thumbnail_map.get(page_num);
		}
		const canvas = document.createElement('canvas');
		// let canvas = tmp_canvas;
		if (!pdfDocument) return;
		const context = canvas.getContext('2d');
		if (!context) return;
		const scale = 0.2;
		const page = await pdfDocument.getPage(page_num);
		const viewport = page.getViewport({ scale: 0.5 });
		canvas.height = viewport.height;
		canvas.width = viewport.width;
		const task = page.render({
			canvasContext: context,
			viewport
		});
		await task.promise;
		const data_url = canvas.toDataURL('image/png');
		thumbnail_map.set(page_num, data_url);
		return data_url;
	}

	const toc = writable<
		Array<{
			title: string;
			pageNumber: number;
			active: boolean;
		}>
	>([]);

	// function handleResize() {
	// 	var containerWidth = container.offsetWidth;
	// 	var containerHeight = containerWidth * (9 / 16); // Maintain aspect ratio
	// 	viewer.style.width = containerWidth + 'px';
	// 	viewer.style.height = containerHeight + 'px';
	// }

	// window.addEventListener('resize', handleResize);

	const save_progress = debounce(() => {
		if (!data.entry?.id) return;
		if (!browser) return;
		fetch(`/api/entry/${data.entry.id}/interaction`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				currentPage,
				progress: currentPage / totalPages
			})
		});
	}, 5000);
	// save progress
	$: currentPage, save_progress();

	// $: currentPage, browser && !document.querySelector(`[data-thumbnail-page="${currentPage}"]`) && virtualList? .scrollTo(currentPage - 1);
	async function render_annotations(page: number) {
		console.log(`rendering annotations for ${page}`);
		await tick();
		for (const annotation of annotations) {
			// get text quote selector
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
			if (page_num !== page) continue;

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

	async function loadPDF() {
		if (!data.entry?.uri) return;
		const pdf_path = data.entry.uri.startsWith('http')
			? data.entry.uri
			: data.S3_BUCKET_PREFIX + data.entry.uri;
		console.log({ pdf_path });
		// Load the PDF document
		pdfDocument = await getDocument({
			url: pdf_path,
			disableAutoFetch: true,
			disableStream: true
		}).promise;
		totalPages = pdfDocument.numPages;

		console.log(await pdfDocument.getMetadata());
		console.log(pdfDocument);
		// Render the initial page
		// see if we have direct annotation link in address bar

		if ($page.url.hash.startsWith('#annotation-')) {
			// then scroll to it
			const id = $page.url.hash.replace('#annotation-', '');
			// window.location.hash = '';
			console.log({ annotations, id });
			// @ts-expect-error
			currentPage = annotations.find((a) => a.id === id)?.target?.page_num ?? currentPage;
			console.log({ currentPage });

			// delete hash
			// remove hash from url
			tick().then(() => {
				window.history.replaceState({}, document.title, window.location.pathname);
			});
		} else if ($page.url.hash.startsWith('#page-')) {
			// then scroll to it
			const page_num = parseInt($page.url.hash.replace('#page-', ''));
			// window.location.hash = '';
			console.log({ page });
			currentPage = page_num;

			console.log({ currentPage });

			// delete hash
			// remove hash from url
			tick().then(() => {
				console.log('pushing state');
				// history.pushState('', document.title, $page.url.pathname + $page.url.search);
			});
		}

		const outline = await pdfDocument.getOutline();

		thumbnails = Array.from({
			length: totalPages
		}).map((_, i) => i);

		// for (let i = 0; i < totalPages; i++) {
		//     thumbnails.push(make_thumbnail(i + 1))
		// }
		console.log({ thumbnails });

		if (outline) {
			for (const item of outline) {
				const dest = item.dest;
				if (!dest) continue;
				if (typeof dest === 'string') {
					const dest_obj = await pdfDocument.getDestination(dest);
					if (dest_obj) {
						const pageNumber = await pdfDocument.getPageIndex(dest_obj[0]);
						$toc.push({
							title: item.title,
							pageNumber: pageNumber + 1,
							active: false
						});
					}
				} else {
					const ref = dest[0];
					const pageNumber = await pdfDocument.getPageIndex(ref);
					$toc.push({
						title: item.title,
						pageNumber: pageNumber + 1,
						active: false
					});
				}
			}
		}

		update_entry(data.entry.id, {
			outline: toc
		});

		await renderPage(currentPage);
	}

	let hydrated = false;

	onMount(async () => {
		// await import??
		if (!data.entry?.uri) return;

		const pdf_path = data.entry.uri.startsWith('http')
			? data.entry.uri
			: data.S3_BUCKET_PREFIX + data.entry.uri;
		console.log({ pdf_path });
		// Load the PDF document
		pdfDocument = await getDocument({
			url: pdf_path,
			disableAutoFetch: true,
			disableStream: true
		}).promise;
		totalPages = pdfDocument.numPages;
		const promises = Array.from({
			length: totalPages
		}).map((_, i) => pdfDocument.getPage(i + 1));

		pages = await Promise.all(promises);

		const viewport = pages[0].getViewport({ scale: 1 });

        const firstPagePromise = pdfDocument.getPage(1);

		console.log({ wrapper, viewport });
		// scale = wrapper?.offsetWidth / viewport.width;
		wrapperHeight = wrapper.offsetHeight || 0;
		wrapperWidth = wrapper.offsetWidth || 0;
		console.log({ scale });

        Promise.all([firstPagePromise]).then(([firstPdfPage]) => {
            const viewport = firstPdfPage.getViewport({
                scale: 1 * PixelsPerInch.PDF_TO_CSS_UNITS
            });

            $state.scale = viewport.scale;
        })



		console.log({ pdfDocument });
		labels =
			(await pdfDocument.getPageLabels()) ??
			Array.from({ length: totalPages }, (_, i) => (i + 1).toString());
		console.log({ labels });

		thumbnails = Array.from({
			length: totalPages
		}).map((_, i) => i);
		hydrated = true;

		// scroll to currentPage
		pdfPageElements[currentPage - 1]?.scrollIntoView();

		// await loadPDF();
		frame = requestAnimationFrame(poll);
	});
	onDestroy(() => {
		if (browser) {
			cancelAnimationFrame(frame);
		}
	});

	$: if ($page.url.hash.startsWith('#page-')) {
		// then scroll to it
		const page_num = parseInt($page.url.hash.replace('#page-', ''));
		// window.location.hash = '';
		console.log({ page });
		currentPage = page_num;

		console.log({ currentPage });

		// delete hash
		console.log('pushing state');
		goto($page.url.pathname);
	}
	// afterUpdate(loadPDF);

	const scales: Record<number, number> = {
		1: 3.2,
		2: 4
	};

	type Zoom = number | 'fit';

	let scale = 1.06667;
	let viewport_scale = scale;
	let scale_to_fit = scale;

	const semantic_scales = {
		auto: 'auto',
		fit: 'fit',
	} as const;

    const preset_scales = {

    }
	let scale_value: number | keyof typeof semantic_scales = 1 * PixelsPerInch.PDF_TO_CSS_UNITS;

	const MAX_AUTO_SCALE = 1.25 * PixelsPerInch.PDF_TO_CSS_UNITS;
	const SCROLLBAR_PADDING = 40;

	// $: if (scale_value === 'auto') {
	//     scale = scale_to_fit;
	// } else if (scale_value === 'fit') {
	//     scale = scale_to_fit;
	// } else {
	//     scale = scale_value;
	// }

	async function renderPage(
		pageNumber: number,
		opts?: {
			noScrollThumbnails?: boolean;
		}
	) {
		if (!pdfDocument) return;
		const page = await pdfDocument.getPage(pageNumber);
		viewport_scale = scale * scales[window.devicePixelRatio || 1] || scale;
		viewport = page.getViewport({ scale: viewport_scale });
		const context = canvas.getContext('2d');
		if (!context) throw new Error('Could not get canvas context');
		canvas.height = viewport.height;
		canvas.width = viewport.width;
		// canvas.style.width = '100%';
		// canvas.style.height = '100%';

		canvas.style.width = `${(viewport.width * scale) / viewport_scale}px`;
		canvas.style.height = `${(viewport.height * scale) / viewport_scale}px`;

		// wrapper.style.width = Math.floor(viewport.width / 10) + 'pt';
		// wrapper.style.height = Math.floor(viewport.height / 10) + 'pt';

		if ($toc.length) {
			const idx = $toc.findLastIndex((t) => t.pageNumber <= currentPage);
			if (idx > -1) {
				$toc.forEach((t) => (t.active = false));
				$toc[idx].active = true;
			}
		}

		const renderTask = page.render({ canvasContext: context, viewport });
		await renderTask.promise;

		const text_content = await page.getTextContent();
		// clear text_layer first
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

		// make sure outline is scrolled into view
		if (!opts?.noScrollThumbnails) {
			const outline = document.querySelector(`[data-thumbnail-page="${currentPage}"]`);
			if (!outline) {
				leftSidebar.scrollTo({
					top: 136 * (currentPage - 1) - outline_container_height / 3
				});
			}
		}

		render_annotations(currentPage);
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

	const debounced_goto = debounce(renderPage, 250, true);


	// x={rect.left - wrapper_rect.left}
	// y={highlightElement.parentElement?.offsetTop}

	let highlights: Array<{
		highlightElements: Array<{
			element: HTMLElement;
			x?: number;
			y?: number;
			rect?: DOMRect;
		}>;
		pageNumber: number;
		id: string;
	}> = [];

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

	let wrapperHeight = 0;
	let wrapperWidth = 0;

	async function highlight() {
		const range = window.getSelection()?.getRangeAt(0);
		if (!range || range.collapsed) return;
		const text_quote_selector = await describeTextQuote(range, wrapper);
		console.log({ text_quote_selector });
		const text_position_selector = describeTextPosition(range, wrapper);
		console.log({ text_position_selector });

		const page_num = Number(
            //@ts-expect-errors
			range.startContainer.parentElement?.closest(`[data-page-number]`)?.dataset?.pageNumber || 0
		);
		console.log({ page_num });
		const target: TargetSchema = {
			source: `pdf:${pdfDocument.fingerprints[0]}`,
			page_num,
			selector: [text_quote_selector, text_position_selector]
		};

		const id = nanoid();
		const h = await highlightSelectorTarget(text_quote_selector, {
			'data-annotation-id': id
		});
		console.log({ h });

		if (target.page_num) {
			pdfPages[target.page_num - 1]?.addHighlight({
				highlightElements: h.flatMap((h) => h.highlightElements),
				id,
				pageNumber: page_num,
				removeHighlights: () => h.map((h) => { h.removeHighlights(); })
			});
			// pdfPageHighlights[target.page_num - 1] = [
			//     ...pdfPageHighlights[target.page_num],
			//     {
			//         highlightElements: h.flatMap((h) => h.highlightElements),
			//         id,
			//         pageNumber: page_num
			//     }
			// ];
		}

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

	async function highlightSelectorTarget(
		selector: TextQuoteSelector | TextPositionSelector,
		attrs?: Record<string, string>
	) {
		console.log(`highlightSelectorTarget`, { selector });
		let matches: AsyncGenerator<Range, void, void>;
		if (selector.type === 'TextQuoteSelector') {
			// REVIEW: should these be moved to the PdfPage component?
			matches = createTextQuoteSelectorMatcher(selector)(wrapper);
		} else {
			matches = createTextPositionSelectorMatcher(selector)(wrapper);
		}
		console.log({ matches });

		// Modifying the DOM while searching can mess up; see issue #112.
		// Therefore, we first collect all matches before highlighting them.
		const matchList = [];
		for await (const match of matches) matchList.push(match);

		return matchList.map((match) => highlightText(match, 'mark', attrs));
		// for (const match of matchList) {
		// 	const el = highlightText(match)
		// };
	}

	const main_nav = useMenuBar();

	const commander = getCommanderContext();

	let edit_note = false;
	let pending_id = '';
	let active_editor: Editor;
	let edit_target: Awaited<ReturnType<typeof highlight>> | undefined = undefined;
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

	let scroller: HTMLElement;
	let virtualScroller: Scroller;

	const scrollBounds = {
		scrollTop: 0,
		clientHeight: 0,
		didReachBottom: false,
		isBottomVisible() {
			return this.scrollTop + this.clientHeight >= (scroller.scrollHeight || 0);
		}
	};

	function updateScrollBounds() {
		if (!scroller) return;
		const { scrollTop, clientHeight } = scroller;
		scrollBounds.scrollTop = scrollTop;
		scrollBounds.clientHeight = clientHeight;
		scrollBounds.didReachBottom = scrollBounds.isBottomVisible();

		// check elements in view
		// TODO: start with first guess, then refine
		const top = scroller.scrollTop,
			bottom = top + scroller.clientHeight;
		const left = scroller.scrollLeft,
			right = left + scroller.clientWidth;
		const firstInViewElIndex = pdfPageElements.findIndex((el) => {
			const elementBottom = el.offsetTop + el.clientTop + el.clientHeight;
			return elementBottom > top;
		});

		const visible: Array<{
			el: HTMLElement;
			pageNum: number;
			x: number;
			y: number;
			percent: number;
			widthPercent: number;
		}> = [];
		// now start looping thru elements
		// if element is in view, add it to the list
		// if element is not in view, stop
		let lastEdge = -1;
		for (let i = firstInViewElIndex; i < pdfPageElements.length; i++) {
			const el = pdfPageElements[i];
			const currentWidth = el.offsetLeft + el.clientLeft;
			const currentHeight = el.offsetTop + el.clientTop;
			const viewWidth = el.clientWidth,
				viewHeight = el.clientHeight;
			const viewRight = currentWidth + viewWidth;
			const viewBottom = currentHeight + viewHeight;
			if (lastEdge === -1) {
				if (viewBottom >= bottom) {
					lastEdge = viewBottom;
				}
			} else if (currentHeight > lastEdge) {
				break;
			}

			if (
				viewBottom <= top ||
				currentHeight >= bottom ||
				viewRight <= left ||
				currentWidth >= right
			) {
				continue;
			}

			const hiddenHeight = Math.max(0, top - currentHeight) + Math.max(0, viewBottom - bottom);
			const hiddenWidth = Math.max(0, left - currentWidth) + Math.max(0, viewRight - right);

			const fractionHeight = (viewHeight - hiddenHeight) / viewHeight,
				fractionWidth = (viewWidth - hiddenWidth) / viewWidth;
			const percent = (fractionHeight * fractionWidth * 100) | 0;

			visible.push({
				el,
				x: currentWidth,
				y: currentHeight,
				percent,
				pageNum: i + 1,
				widthPercent: (fractionWidth * 100) | 0
			});
		}

		const first = visible[0],
			last = visible.at(-1);
		// sort by visibility

		// find highest percent
		const highest = visible.reduce((a, b) => (a.percent > b.percent ? a : b));

		// visible.sort((a, b) => {
		// 	const pc = a.percent - b.percent;
		// 	if (Math.abs(pc) > 0.001) {
		// 		return -pc;
		// 	}
		// 	return a.pageNum - b.pageNum;
		// });

		// console.log({ visible });

		currentPage = highest.pageNum;

		update_thumbnail_scroll();
	}

	const throttledUpdateScrollBounds = throttle(updateScrollBounds, 250);

    createRenderQueueContext();

    const state = pdf_context();

	function scroll_page_into_view(page_num: number) {
		const page = pdfPageElements[page_num - 1];
		console.log({ page });
		if (!page) return;
		page.scrollIntoView();
	}

	function update_thumbnail_scroll() {
		virtualScroller.scrollTo(currentPage - 1, {
			height: 136
		});
	}



	function handle_resize(event: UIEvent & { currentTarget: EventTarget & Window; }) {
		throw new Error('Function not implemented.');
	}



</script>

<!-- keyboard nav -->
<svelte:window
on:resize={handle_resize}
	on:keydown={(e) => {
		if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
			e.preventDefault();
			goToPreviousPage();
		}
		if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
			e.preventDefault();
			goToNextPage();
		}
		// If space, check if the scroller is scrolled to the bottom. If so, go to next page
		// if (e.key === ' ' && scroller) {
		// 	const { scrollHeight, scrollTop, clientHeight } = scroller;
		// 	console.log({ scrollHeight, scrollTop, clientHeight });
		// 	if (scrollHeight - scrollTop === clientHeight) {
		// 		console.log('scrolled to bottom');
		// 		goToNextPage();
		// 		e.preventDefault();
		// 	}
		// }
	}}
/>

<Selection
	on:highlight={async ({ detail }) => {
		const { form, el } = detail;
		const highlight_data = await highlight();
		if (!highlight_data) return;
		// tell page to re-render annotations
		const { h, ...target } = highlight_data;
		if (!target) return;
		console.log('form', get(form));
		console.log({ el });

		// update_entry(data.entry, {
		//     tartget,
		//     type: "annotation"
		// })

		if (!data.entry) return;

		if (data.entry) {
			data.entry.annotations = [
				...(data.entry.annotations || []),
				{
					target,
					username: data.user_data.username
				}
			];
		}

		update_entry(data.entry.id, {
			annotations: [
				...(data.entry.annotations || []),
				{
					target,
					username: data.user_data.username
				}
				// annotation
			]
		});
		// if (target.page_num) pdfPages[target.page_num - 1]?.renderAnnotations()

		mutation($page, 'save_note', {
			type: 'annotation',
			entryId: data.entry?.id,
			target
		}).then(() => {
			invalidate('entry');
		});
		// form.update(($form) => {
		// 	return {
		// 		...$form,
		// 		target
		// 	};
		// });
		// el.requestSubmit();
	}}
	on:annotate={async ({ detail }) => {
		console.log({ detail });
		// mvp: srs form

		const target = await highlight();

		if (!target) return;

		annotationRef(target.h[0].highlightElements[0]);

		edit_note = true;
		edit_target = target;
		// pending_id =
	}}
/>

{#if edit_note}
	<div
		class="z-50"
		use:clickOutside={() => {
			edit_note = false;
			edit_target?.h.forEach((h) => { h.removeHighlights(); });
		}}
		use:annotationContent
	>
		<div
			class="bg-popover text-popover-foreground z-50 rounded-lg border shadow-2xl w-80 sm:w-96"
			use:draggable
		>
			<Editor bind:this={active_editor} class=" border-none p-8 sm:p-8" />
			<Button
				on:click={() => {
					// TODO: save contentData of this annotation (Editor component will take care of sub-components)
					active_editor.save((json) => {
						// submit annotation...
						// @ts-expect-error — shouldn't be getting an error here but I am
						const { h, ...target } = edit_target;
						if (!data.entry?.id) return;

						// TODO: clean up all the mismatched types here (it works but it's ugly)

						const annotation = {
							id: pending_id || undefined,
							type: 'annotation',
							contentData: json,
							target,
							entryId: data.entry?.id,
							username: $page.data.user_data.username
						};

						update_entry(data.entry.id, {
							annotations: [
								...(data.entry.annotations || []),
								annotation
								// annotation
							]
						});

						toast
							.promise(mutation($page, 'save_note', annotation), {
								loading: 'Saving annotation...',
								success: 'Annotation saved',
								error: 'Failed to save annotation'
							})
							.finally(() => {
								edit_note = false;
								invalidate('entry');
								// edit_target?.h.forEach((h) => h.removeHighlights());
							});
					});
				}}>save</Button
			>
		</div>
		<!-- <PromptInput target_schema={edit_target} entry_id={data.entry?.id} /> -->
	</div>
{/if}

<noscript> Javascript is required to view PDFs. </noscript>

<!-- Left Sidebar -->
<div
	class="overflow-y-auto h-[calc(100vh-var(--nav-height))] border grow shrink-0 basis-1/3 max-w-xs"
	use:leftSidebarPortal
	bind:this={leftSidebar}
>
	<!-- Thumbnails -->
	{#if hydrated}
		<Scroller bind:this={virtualScroller} items={thumbnails} b={10}>
			<div slot="item" let:item={thumbnail}>
				{@const active = currentPage === thumbnail + 1}
				<button
					data-thumbnail-page={thumbnail + 1}
					class:selected={active}
					class="relative h-[136px] p-2 flex flex-col cursor-pointer justify-end items-center rounded-md pointer max-w-full mx-8 {active
						? 'bg-secondary'
						: ''}"
					draggable="false"
					on:click={() => {
						currentPage = thumbnail + 1;
						scroll_page_into_view(thumbnail + 1);
						// renderPage(thumbnail + 1, {
						// 	noScrollThumbnails: true
						// });
					}}
				>
					{#if thumbnail_map.has(thumbnail + 1)}
						<img
							src={thumbnail_map.get(thumbnail + 1)}
							draggable="false"
							class="h-auto w-24 object-cover rounded-sm max-w-full max-h-[120px] ring-red-500"
							alt=""
							class:ring={active}
						/>
					{:else}
						{#await make_thumbnail(thumbnail + 1)}
							<Skeleton class="h-[136px] w-24" />
						{:then src}
							{#if src}
								<img
									{src}
									draggable="false"
									class="h-auto w-24 object-cover rounded-sm max-w-full max-h-[120px] ring-red-500"
									class:ring={active}
									alt=""
								/>
							{/if}
						{/await}
					{/if}
					<span
						class={cn(
							'tabular-nums  flex justify-center items-center absolute min-w-[20px] h-4 b-4 rounded-xl font-medium text-xs px-1 bg-muted text-muted-foreground',
							active && 'bg-accent text-accent-foreground'
						)}>{labels[thumbnail]}</span
					>
				</button>
			</div>
			<!-- sdsd -->
		</Scroller>
	{/if}
	<!-- <VirtualList
		bind:this={virtualList}
		items={thumbnails}
		let:item={thumbnail}
		itemHeight={136}
		containerHeight={outline_container_height}
		scrollTop={leftSidebarScrollTop}
		let:dummy
		let:y
	>
		{@const active = currentPage === thumbnail + 1}
		<div
			data-thumbnail-page={thumbnail + 1}
			class="relative p-2 flex flex-col cursor-pointer justify-end items-center rounded-md pointer max-w-full mx-8 {active
				? 'bg-secondary'
				: ''}"
			draggable="false"
			class:dummy
			style="top:{y}px;"
			on:click={() => {
				currentPage = thumbnail + 1;
				renderPage(thumbnail + 1, {
					noScrollThumbnails: true
				});
			}}
		>
			{#if !dummy}
				{#if thumbnail_map.has(thumbnail + 1)}
					<img
						src={thumbnail_map.get(thumbnail + 1)}
						draggable="false"
						class="h-auto w-24 object-cover rounded-sm max-w-full max-h-[120px]"
						alt=""
						class:ring={active}
					/>
				{:else}
					{#await make_thumbnail(thumbnail + 1)}
						<Skeleton class="h-[136px] w-24" />
					{:then src}
						{#if src}
							<img
								{src}
								draggable="false"
								class="h-auto w-24 object-cover rounded-sm max-w-full max-h-[120px]"
								class:ring={active}
								alt=""
							/>
						{/if}
					{/await}
				{/if}
				<span
					class={cn(
						'tabular-nums  flex justify-center items-center absolute min-w-[20px] h-4 b-4 rounded-xl font-medium text-xs px-1 bg-muted text-muted-foreground',
						active && 'bg-accent text-accent-foreground'
					)}>{thumbnail + 1}</span
				>
			{/if}
		</div>
	</VirtualList> -->
</div>

<!-- PDF Toolbar -->
<div class="c-pdf-toolbar h-[--nav-height] flex items-stretch justify-between relative px-3 py-1">
	<!-- Pdf Toolbar - left -->
	<div class="c-pdf-toolbar-left flex items-center gap-3">
		<div class="flex tabular-nums text-sm gap-x-1 shrink-0 items-center">
			<Input
				value={labels[currentPage - 1]}
				on:change={(e) => {
					// @ts-expect-error
					const value = e.target?.value;
					console.log({ e });
					if (!value) return;
					console.log({ value });
					console.log({ labels });
					const idx = labels.indexOf(value);
					console.log({ idx });
					if (idx === -1) return;
					scroll_page_into_view(idx + 1);
				}}
				min={1}
				max={totalPages}
			/>
			<span class="shrink-0">of {totalPages}</span>
		</div>
		<div class="flex items-center">
			<Button
				on:click={() => {
					scale += 0.25;
					// renderPage(currentPage);
				}}
				size="sm"
				variant="ghost"
			>
				<ZoomInIcon class="h-4 w-4" />
				<span class="sr-only">Zoom in</span>
			</Button>
			<Button
				on:click={() => {
					scale -= 0.25;
					// renderPage(currentPage);
				}}
				size="sm"
				variant="ghost"
			>
				<ZoomOutIcon class="h-4 w-4" />
				<span class="sr-only">Zoom out</span>
			</Button>
			<NativeSelect
				on:change={(e) => {
					//@ts-expect-error
					const value = e.target?.value;
					if (!value) return;
					if (value === 'auto') {
						// scale = 'auto';
					} else if (value === 'fit') {
						// scale = 'fit';
					} else {
						scale = Number(value);
					}
				}}
				bind:value={scale_value}
			>
				<option value="auto">Auto</option>
				<option value="fit">Fit to page</option>
				<option value={0.5 * PixelsPerInch.PDF_TO_CSS_UNITS}>50%</option>
				<option value={0.75 * PixelsPerInch.PDF_TO_CSS_UNITS}>75%</option>
				<option value={1 * PixelsPerInch.PDF_TO_CSS_UNITS}>100%</option>
				<option value={1.25 * PixelsPerInch.PDF_TO_CSS_UNITS}>125%</option>
				<option value={1.5 * PixelsPerInch.PDF_TO_CSS_UNITS}>150%</option>
				<option value={2 * PixelsPerInch.PDF_TO_CSS_UNITS}>200%</option>
				<option value={3 * PixelsPerInch.PDF_TO_CSS_UNITS}>300%</option>
				<option value={4 * PixelsPerInch.PDF_TO_CSS_UNITS}>400%</option>
			</NativeSelect>
		</div>
		<DropdownMenu>
			<DropdownMenuTrigger class={buttonVariants({ variant: 'ghost', size: 'sm' })}>
				<MoreHorizontalIcon size={16} />
			</DropdownMenuTrigger>
			<DropdownMenuContent placement="top-start" class="w-56">
				<DropdownMenuGroup>
					<DropdownMenuItem
						on:click={() => {
							if (show_text_version) {
								show_text_version = false;
								return;
							}
							toast.promise(get_pdf_text(pdfDocument), {
								loading: 'Loading text version...',
								success: (val) => {
									text = val;
									show_text_version = true;
									return 'Text version loaded';
								},
								error: 'Failed to load text version'
							});
						}}
					>
						<TextSelectIcon class="mr-2 h-4 w-4" />
						Read as {show_text_version ? 'PDF' : 'text'}
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem
						on:click={() => {
							commander.open({
								component: JumpToEntry,
								placeholder: 'Select item to group PDF under...',
								shouldFilter: false,
								props: {
									onSelect(entry) {
										if (!data.entry) return;
										// TODO: add grouping relation
										toast
											.promise(
												post(`/entry/${data.entry.id}?/relation`, {
													relatedEntryId: entry.id,
													type: 'Grouped'
												}),
												{
													loading: 'Grouping PDF...',
													success: 'PDF grouped',
													error: 'Failed to group PDF'
												}
											)
											.finally(() => {
												console.log('promise done');
												commander.close();
											});
									}
								}
							});
						}}
					>
						<GroupIcon class="mr-2 h-4 w-4" />
						Group
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	</div>
</div>

<!-- style:height="min({(viewport?.height * scale) / viewport_scale}px, 100%)" -->
<div class="grow h-[calc(100vh-6rem)] overflow-hidden relative min-w-[350px]">
	<!-- pdf content container -->
	<div class="absolute inset-0 min-w-[350px]">
		<!-- pdf viewer container -->
		<div
			on:scroll={throttledUpdateScrollBounds}
			bind:this={scroller}
			class="absolute overflow-auto border inset-0"
		>
			<div
				use:resize={(e) => {
					// console.log(`resize wrapper`, { e });
					// wrapperWidth = e.contentBoxSize[0].inlineSize;
					// wrapperHeight = e.contentBoxSize[0].blockSize;
					// if (!pdfPages[0]) return;
					// const width = pdfPages[0].getWidth();
					// const currentScale = pdfPages[0].getScale();
					// const pageWidthScale = ((wrapperWidth - SCROLLBAR_PADDING) / width) * currentScale;
					// console.log({ MAX_AUTO_SCALE, pageWidthScale });
					// if (scale_value === 'auto') {
					// 	scale = Math.min(MAX_AUTO_SCALE, pageWidthScale);
					// }
				}}
				bind:this={wrapper}
				id="article"
                style:--scale-factor="{$state.scale}"
			>
				<!-- floating toolbar -->
				{#if show_text_version}
					<div class="prose prose-stone space-y-4 whitespace-pre-line dark:prose-invert">
						{@html text}
					</div>
				{:else}
					<!-- TODO: Scrolly.svelte -->
					<!-- {#if hydrated}
					<Scroller items={pages} key={'pageNumber'}>
						<svelte:fragment slot="item" let:item={page}>
							<PdfPage
								on:rendered={() => {
									console.log('rendered', page.pageNumber);
								}}
								on:focused={(e) => {
									console.log('focused!', e);
									// currentPage = page.pageNumber ;
								}}
								{page}
								bind:scale
								bind:scale_to_fit
								{annotations}
								{...scrollBounds}
							/>
						</svelte:fragment>
					</Scroller>
                    {/if} -->
                    <!-- bind:scale -->
					{#each pages as page, i (page.pageNumber)}
						<PdfPage
							bind:ref={pdfPageElements[i]}
							bind:this={pdfPages[i]}
							bind:highlights={pdfPageHighlights[i]}
							on:rendered={() => {
								console.log('rendered', page.pageNumber);
							}}
							on:focused={(e) => {
								console.log('focused!', e);
								// currentPage = page.pageNumber ;
							}}
							{page}
                            {scale}
							bind:scale_to_fit
							{annotations}
							{...scrollBounds}
						/>
					{/each}
					<!-- Page -->
					<!-- <div id="container">
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
					</div> -->
				{/if}
			</div>
		</div>
	</div>
</div>

<style lang="postcss">
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

	/* #svg-layer {

        margin-left: auto;
        margin-right: auto;
    } */
</style>
