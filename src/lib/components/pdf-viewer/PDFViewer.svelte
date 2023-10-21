<script lang="ts">
	// import downloadsvg from './images/toolbarDownload.svg?url';
	// import printsvg from './images/toolbarPrint.svg?url';
	// import zoominsvg from './images/toolbarZoomIn.svg?url';
	// import zoomoutsvg from './images/toolbarZoomOut.svg?url';
	// import spreadsvg from './images/toolbarPageView.svg?url';
	// import gapsvg from './images/toolbarPageGap.svg?url';
	import './pdfviewer.css';

	import type { Annotation } from '@prisma/client';
	import { createMutation, useQueryClient } from '@tanstack/svelte-query';
	import { nanoid } from 'nanoid';
	import type { PDFDocumentProxy } from 'pdfjs-dist';
	import * as pdfjs from 'pdfjs-dist';
	import { afterUpdate, onMount, tick } from 'svelte';
	import { toast } from 'svelte-sonner';

	import { page } from '$app/stores';
	import { Skeleton } from '$components/ui/skeleton';
	import trackScroll from '$lib/actions/trackScroll';
	import type { TargetSchema } from '$lib/annotation';
	import {
		createTextPositionSelectorMatcher,
		createTextQuoteSelectorMatcher,
		describeTextPosition,
		describeTextQuote,
	} from '$lib/annotator';
	import { highlightText } from '$lib/annotator/highlighter';
	import type {
		TextPositionSelector,
		TextQuoteSelector,
	} from '$lib/annotator/types';
	import { makeAnnotation } from '$lib/helpers';
	import {
		mutate,
		type MutationInput,
		type QueryOutput,
	} from '$lib/queries/query';
	import type { EntryAnnotation } from '$lib/queries/server';
	import type { Type } from '$lib/types';
	import { getTargetSelector } from '$lib/utils/annotations';
	import { numberOrString } from '$lib/utils/misc';

	import { getEntryContext } from '../../../routes/(app2)/(listables)/[type=type]/ctx';
	import { getPdfStateContext } from './utils';
	import { sleep } from '@melt-ui/svelte/internal/helpers';
	import throttle from 'just-throttle';

	export let annotations: Array<EntryAnnotation> = [];

	const annotationMap = new Map<
		string,
		Awaited<ReturnType<typeof highlightSelectorTarget>>
	>();

	// pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

	// set to public cdn
	pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

	let loading = true;
	let _error: any;

	export let url: string | URL; //url of pdf.
	const INTERNAL_URL = url.toString();

	// TODO: probably move this out of this component?

	export const { rightSidebar, scrollingDown } = getEntryContext();

	// TODO: this should be in context
	$: queryKey = [
		'entries',
		'detail',
		{
			input: {
				id: numberOrString($page.params.id ?? ''),
				type: $page.data.type as Type,
			},
		},
	];

	const queryClient = useQueryClient();
	const annotateMutation = createMutation({
		mutationFn: async (input: MutationInput<'save_note'>) => {
			const { data } = $page;
			if (!data.entry) {
				return;
			}
			return mutate('save_note', {
				entryId: data.entry.id,
				...input,
			});
		},
		onError: (err, newTodo, context) => {
			toast.error('Failed to save annotation');
			if (context) {
				// @ts-expect-error - TODO: why is ts complaining about this?
				queryClient.setQueryData(queryKey, context.previousEntryData);
			}
		},
		async onMutate(newData) {
			await queryClient.cancelQueries({
				queryKey: ['entries'],
			});

			// Snapshot the previous value
			const previousEntryData =
				queryClient.getQueryData<QueryOutput<'entry_by_id'>>(queryKey);

			// // Optimistically update to the new value
			queryClient.setQueryData<QueryOutput<'entry_by_id'>>(queryKey, (old) => {
				if (!old) {
					return old;
				}
				if (!old.entry) {
					return old;
				}

				const ids = Array.isArray(newData.id) ? newData.id : [newData.id];

				const newAnnotations = ids.map((id) => {
					const { tags, ...rest } = newData;
					// TODO: tags
					return makeAnnotation({
						// @ts-expect-error TODO: why is ts complaining about this?
						id: id!,
						...rest,
					});
				});

				const oldIds = old.entry.annotations?.map((a) => a.id) ?? [];
				const annotationsToAdd = newAnnotations.filter(
					(a) => !oldIds.includes(a.id),
				);

				const updatedAnnotations = (old.entry.annotations ?? [])
					.map((annotation) => {
						if (ids.includes(annotation.id)) {
							return {
								...annotation,
								...newAnnotations.find((a) => a.id === annotation.id),
							};
						}
						return annotation;
					})
					.concat(annotationsToAdd);

				annotations = updatedAnnotations;

				return {
					...old,
					entry: {
						...old.entry,
						annotations: [...updatedAnnotations],
					},
				};
			});

			if ($rightSidebar) {
				await tick();
				const sidebarEl = document.getElementById('entry-sidebar');
				if (sidebarEl) {
					const annotationEl = sidebarEl.querySelector(
						`[data-sidebar-annotation-id="${newData.id}"]`,
					);
					if (annotationEl) {
						annotationEl.scrollIntoView();
					}
				}
				// scroll to new annotation
			}

			// // Return a context object with the snapshotted value
			return { previousEntryData };
		},
		onSettled(data, error, variables, context) {
			void queryClient.invalidateQueries({
				queryKey: ['entries'],
			});
		},
	});

	let classname = ''; //allows component to recieve classes
	export { classname as class };

	let styles = ''; //allows component to recieve classes
	export { styles as style };

	const pdf_state = getPdfStateContext();
	$: opts = $pdf_state.opts;

	const MIN_SCALE = 0.5;
	const MAX_SCALE = 2.3;

	enum SpreadModes { //init display modes.
		'NONE',
		'ODD',
		'EVEN',
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
		attrs?: Record<string, string>,
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
		for await (const match of matches) {
			matchList.push(match);
		}

		console.log({ matchList });

		return matchList.map((match) => highlightText(match, 'mark', attrs));
	}

	export async function highlight() {
		const range = window.getSelection()?.getRangeAt(0);
		if (!range || range.collapsed) {
			return;
		}
		const text_quote_selector = await describeTextQuote(range, container);
		const text_position_selector = describeTextPosition(range, container);

		const page_num = Number(
			range.startContainer.parentElement?.closest(`[data-page-number]`)?.dataset
				?.pageNumber || 0,
		);
		const target: TargetSchema = {
			page_num,
			selector: [text_quote_selector, text_position_selector],
			source: `pdf:${pdf_document.fingerprints[0]}`,
		};

		const id = nanoid();
		const h = await highlightSelectorTarget(text_quote_selector, {
			'data-annotation-id': id,
		});

		annotationMap.set(id, h);

		// TODO: calculate x,y,w,h of highlight and store it in the annotation

		$annotateMutation.mutate({
			id,
			target,
		});

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
			h,
		};
	}

	async function render_annotations(pageNum: number) {
		await tick();
		await sleep(1000);
		console.log(`render_annotations`, { pageNum, annotations });
		for (const annotation of annotations) {
			if (!annotation.target) {
				continue;
			}
			const page_num = (annotation.target as TargetSchema).page_num;
			const text_quote_selector = getTargetSelector(
				annotation.target as TargetSchema,
				'TextQuoteSelector',
			);
			const text_position_selector = getTargetSelector(
				annotation.target as TargetSchema,
				'TextPositionSelector',
			);
			// const page_selector = getTargetSelector(annotation.target as TargetSchema, 'BookSelector');
			if (!text_quote_selector || !page_num) {
				continue;
			}
			if (page_num !== pageNum) {
				continue;
			}

			// check if the annotation element already exists
			const existing = container.querySelector(
				`[data-annotation-id="${annotation.id}"]`,
			);
			console.log({ existing });
			if (existing) {
				continue;
			}

			console.log({ text_quote_selector });
			const h = await highlightSelectorTarget(text_quote_selector, {
				'data-annotation-id': annotation.id,
			});
			annotationMap.set(annotation.id, h);
			console.log({ h });
		}
	}

	function getLoadedPages() {
		const activePages = container.querySelectorAll(
			`[data-page-number][data-loaded="true"]`,
		);

		return Array.from(activePages)
			.map((el) => el instanceof HTMLElement && Number(el.dataset.pageNumber))
			.filter(Boolean);
	}

	async function ensureHighlights() {
		// for (const [id, annotation] of Object.entries($annotations)) {
		if (!annotations) {
			return;
		}

		const activePages = getLoadedPages();
		for (const annotation of annotations) {
			const { id } = annotation;
			const target = annotation.target!;
			const { page_num } = target;
			if (!page_num || !activePages.includes(page_num)) {
				continue;
			}
			const el = container?.querySelector(`[data-annotation-id="${id}"]`);
			if (!el) {
				const selector = getTargetSelector(
					annotation.target,
					'TextQuoteSelector',
				);
				if (selector) {
					const h = await highlightSelectorTarget(selector, {
						'data-annotation-id': id,
						'data-has-body': `${!!(annotation.body ?? annotation.contentData)}`,
						id: `annotation-${annotation.id}`,
					});
					annotationMap.set(annotation.id, h);
				}
			}
		}

		// remove old ones
		const els = container?.querySelectorAll(`[data-annotation-id]`);
		if (els) {
			for (const el of els) {
				if (!(el instanceof HTMLElement)) {
					continue;
				}
				const id = el.dataset.annotationId;
				if (!id) {
					continue;
				}
				const annotation = annotations.find((a) => a.id === id);
				if (!annotation) {
					const h = annotationMap.get(id);
					if (h) {
						h.map((h) => h.removeHighlights());
					}
				}
			}
		}
	}

	const throttledEnsureHighlights = throttle(ensureHighlights, 500);

	afterUpdate(() => {
		console.log('afterUpdate');
		throttledEnsureHighlights();
	});

	const printPdf = (url: string) => {
		const iframe = document.createElement('iframe');
		document.body.append(iframe);

		iframe.style.display = 'none';
		iframe.onload = function () {
			setTimeout(() => {
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
		if (
			['static', 'initial'].includes(
				getComputedStyle(component_container).position,
			)
		) {
			console.warn(
				'PdfViewer sizing only works when it is positioned (not static).',
			);
		}
		const init_promise = import('pdfjs-dist/web/pdf_viewer.js').then(
			(pdfjs_viewer) => {
				const event_bus = new pdfjs_viewer.EventBus();
				$pdf_state.event_bus = event_bus;

				// (Optionally) enable hyperlinks within PDF files.
				const pdf_link_service = new pdfjs_viewer.PDFLinkService({
					eventBus: event_bus,
				});

				$pdf_state.pdf_link_service = pdf_link_service;

				event_bus.on(
					'pagerendered',
					({ pageNumber }: { pageNumber: number }) => {
						console.log(`pagerendered`, { pageNumber });
						render_annotations(pageNumber);
						// can use this to render SVG highlights (we use our annotator to highlight textlayer, and then attach svgs to those elements)
						// console.log(`pagerendered`, e);
					},
				);

				// (Optionally) enable find controller.
				const pdf_find_controller = new pdfjs_viewer.PDFFindController({
					eventBus: event_bus,
					linkService: pdf_link_service,
				});
				const pdf_viewer = new pdfjs_viewer.PDFViewer({
					container,
					eventBus: event_bus,
					findController: pdf_find_controller,
					l10n: pdfjs_viewer.NullL10n,
					linkService: pdf_link_service,
				});
				$pdf_state.pdf_viewer = pdf_viewer;
				pdf_link_service.setViewer(pdf_viewer);

				event_bus.on('pagechanging', () => {
					console.log('pagechanging', pdf_viewer);
					$pdf_state.pageNumber = pdf_viewer.currentPageNumber;
				});
				return { pdf_link_service, pdf_viewer };
			},
		);

		const renderDocument = async () => {
			const { pdf_link_service, pdf_viewer } = await init_promise;
			// Loading document.
			const loading_task = pdfjs.getDocument({
				isEvalSupported: false,
				password,
				url,
			});
			loading_task.promise
				.then((_pdf_document) => {
					pdf_document = _pdf_document;
					pdf_viewer.setDocument(pdf_document);
					pdf_link_service.setDocument(pdf_document, null);
					// pdf_viewer.currentScaleValue = "page-width";
					console.log({ pdf_viewer });
					pdf_viewer.currentScaleValue = 'auto';
					// if (typeof $opts.scale === 'number') {
					//     pdf_viewer.currentScale = $opts.scale;
					// } else {
					//     pdf_viewer.currentScaleValue = $opts.scale;
					// }
					pdf_viewer.spreadMode = _spread_mode;
					// loading = false;
				})
				.catch((error) => {
					console.log({ error });
					password_error = true;
					_error = error;
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
			loading = false;
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
			a.download = url.slice(Math.max(0, url.lastIndexOf('/') + 1));
		}
		// <a> must be in the document for recent Firefox versions,
		// otherwise .click() is ignored.
		(document.body || document.documentElement).append(a);
		a.click();
		a.remove();
	}

	function handleKeydown(e: KeyboardEvent) {
		// zoom in and out: shift + +/-
		if (e.shiftKey && e.key === '+') {
			e.preventDefault();
			pdf_state.zoomIn();
		} else if (e.shiftKey && e.key === '_') {
			e.preventDefault();
			pdf_state.zoomOut();
		}
	}
</script>

<!-- keyboard shortcuts -->
<svelte:window on:keydown={handleKeydown} />

{#if loading}
	<div
		class="absolute h-full w-full z-10 px-6 py-[calc(var(--nav-height)+1rem)]"
	>
		<Skeleton class="p-4 h-full w-full" />
	</div>
{/if}
<div
	class={classname}
	style={styles}
	bind:this={component_container}
	data-dark-mode-invert={$opts.darkModeInvert}
>
	<div id="viewer-parent" class="w-full h-full">
		{#if password_error}
			<div class="spdfinner pt-[80px]">
				{JSON.stringify(_error)}
				<p>This document requires a password to open:</p>
				<p>{password_message}</p>
				<div>
					<input type="password" bind:value={password} />
					<button on:click={onPasswordSubmit} class="password-button">
						Submit
					</button>
				</div>
			</div>
		{:else}
			<div class="spdfinner">
				<div
					id="viewerContainer"
					use:trackScroll={{
						scrollingDown,
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

<style lang="postcss">
	[data-dark-mode-invert='true'] :global(.canvasWrapper) {
		filter: invert(1) hue-rotate(180deg);
		mix-blend-mode: screen;
	}
	[data-dark-mode-invert='true'] :global(.page) {
		background-color: transparent;
	}

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
