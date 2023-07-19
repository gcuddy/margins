<script lang="ts">
	import type { TargetSchema } from '$lib/annotation';
	import {
		createTextPositionSelectorMatcher,
		createTextQuoteSelectorMatcher,
		describeTextPosition,
		describeTextQuote
	} from '$lib/annotator';
	import { highlightText } from '$lib/annotator/highlighter';
	import type { TextPositionSelector, TextQuoteSelector } from '$lib/annotator/types';
	import Button, { buttonVariants } from '$lib/components/ui/Button.svelte';
	import { nanoid } from '$lib/nanoid';
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
		GlobalWorkerOptions,
		PDFDocumentProxy,
		getDocument,
		renderTextLayer,
		version,
		PageViewport,
		PDFWorker
	} from 'pdfjs-dist';
	import { getContext, onDestroy, onMount, tick } from 'svelte';
	import type { PageData } from './$types';
	import Selection from './Selection.svelte';
	import { getTargetSelector } from '$lib/utils/annotations';
	import { useMenuBar } from '../../../MainNav.svelte';
	import debounce from 'just-debounce-it';
	import { browser } from '$app/environment';
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuGroup,
		DropdownMenuItem,
		DropdownMenuSeparator,
		DropdownMenuTrigger
	} from '$lib/components/ui/dropdown-menu';
	import { build_toc, get_pdf_text } from '$lib/utils/pdf';
	import toast from 'svelte-french-toast';
	import { useCommanderContext } from '../../../Commander.svelte';
	import { getCommanderContext } from '$lib/commands/GenericCommander.svelte';
	import JumpToEntry from '$lib/commands/JumpToEntry.svelte';
	import { post } from '$lib/utils/forms';
	import { createPopperActions, type ContentAction } from 'svelte-popperjs';
	import { dialog_store } from '$components/ui/singletons/Dialog.svelte';
	import type { H } from 'drizzle-orm/column.d-aa4e525d';
	import PromptInput from '$components/ui/srs-card/PromptInput.svelte';
	import { clickOutside } from '$lib/actions/clickOutside';
	import { forEach } from 'lodash';
	import { draggable } from '@neodrag/svelte';
	import { page } from '$app/stores';
	import Editor from '$components/ui/editor/Editor.svelte';
	import { mutation } from '$lib/queries/query';
	import { goto, invalidate, invalidateAll } from '$app/navigation';
	import { update_entry } from '$lib/state/entries';
	import { Writable, get, writable } from 'svelte/store';
	import Input from '$components/ui/Input.svelte';
	import { leftSidebarPortal } from '../LeftSidebar.svelte';
	import VirtualList from '$components/ui/internal/VirtualList.svelte';
	import Skeleton from '$components/ui/skeleton/Skeleton.svelte';
	import { cn } from '$lib/utils/tailwind';
	import type { PDFPageProxy } from 'pdfjs-dist/types/src/display/api';
	import PdfPage from './PDFPage.svelte';
	export let data: PageData;

	$: annotations = data.entry?.annotations ?? [];

	let show_text_version = false;
	let text = '';
	let loading_text_version = false;

	GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.js`;

	let pdfDocument: PDFDocumentProxy;
	$: console.log({ pdfDocument });

	let currentPage = data.entry?.interaction?.currentPage ?? 1;
	let totalPages = 0;
	let canvas: HTMLCanvasElement;
	let wrapper: HTMLDivElement;
	let text_layer: HTMLDivElement;
	let viewport: PageViewport;
	let container: HTMLElement;

	let thumbnails: number[] = [];
	let thumbnail_map = new Map<number, string>();
	let virtualList: VirtualList;

	let outline_container_height = 0;
	let leftSidebar: HTMLElement;
	let leftSidebarScrollTop = 0;
	let frame: number;



    let pages: PDFPageProxy[] = [];



	function poll() {
		if (leftSidebar?.scrollTop !== leftSidebarScrollTop) {
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
		{
			title: string;
			pageNumber: number;
			active: boolean;
		}[]
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
		if (!data?.entry?.uri) return;
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

	onMount(async () => {
		// await import??
        if (!data?.entry?.uri) return;

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
        }).map((_, i) => pdfDocument.getPage(i + 1))

        pages = await Promise.all(promises);

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

	let scale = 2;
	let viewport_scale = scale;

	async function renderPage(pageNumber: number, opts?: {
        noScrollThumbnails?: boolean
    }) {
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
                leftSidebar?.scrollTo({
                    top: (136 * (currentPage - 1)) - (outline_container_height / 3)
                });
            }
        }

		render_annotations(currentPage);
	}

	$: console.log({ highlights });

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

	$: currentPage, debounced_goto(currentPage);

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

	async function highlight() {
		const range = window.getSelection()?.getRangeAt(0);
		if (!range || range.collapsed) return;
		const text_quote_selector = await describeTextQuote(range);
		console.log({ text_quote_selector });
		const text_position_selector = describeTextPosition(range);
		console.log({ text_position_selector });

		const target: TargetSchema = {
			source: `pdf:${pdfDocument.fingerprints[0]}`,
			page_num: currentPage,
			selector: [text_quote_selector, text_position_selector]
		};

		const id = nanoid();
		const h = await highlightSelectorTarget(text_quote_selector, {
			'data-annotation-id': id
		});

		highlights = [
			...highlights,
			{
				highlightElements: h.flatMap((h) => h.highlightElements).map(calculate_h),
				pageNumber: currentPage,
				id
			}
		];

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

	$: currentPage,
		scroller?.scrollTo({
			top: 0
		});
</script>

<!-- keyboard nav -->
<svelte:window
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
		if (e.key === ' ' && scroller) {
			const { scrollHeight, scrollTop, clientHeight } = scroller;
			console.log({ scrollHeight, scrollTop, clientHeight });
			if (scrollHeight - scrollTop === clientHeight) {
				console.log('scrolled to bottom');
				goToNextPage();
				e.preventDefault();
			}
		}
	}}
/>

<Selection
	on:highlight={async ({ detail }) => {
		const { form, el } = detail;
		const { h, ...target } = await highlight();
		if (!target) return;
		console.log('form', get(form));
		console.log({ el });

		// update_entry(data.entry, {
		//     tartget,
		//     type: "annotation"
		// })

		if (!data.entry) return;

		// update_entry(data.entry.id, {
		// 	annotations: [
		// 		...(data.entry.annotations || []),
		// 		{
		//             target,
		//             username: data.user_data.username,

		//         }
		// 		// annotation
		// 	]
		// });

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
			edit_target?.h.forEach((h) => h.removeHighlights());
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

<!-- Left Sidebar -->
<div
	class="overflow-y-auto h-[calc(100vh-var(--nav-height))] border grow shrink-0 basis-1/3 max-w-xs"
	use:leftSidebarPortal
	bind:this={leftSidebar}
	bind:clientHeight={outline_container_height}
>
	<!-- Thumbnails -->
	<VirtualList
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
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
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
	</VirtualList>
	{#each thumbnails.slice(0, 25) as thumbnail}{/each}
</div>

<!-- PDF Toolbar -->
<div class="c-pdf-toolbar h-[--nav-height] flex items-stretch justify-between relative px-3 py-1">
	<!-- Pdf Toolbar - left -->
	<div class="c-pdf-toolbar-left flex items-center gap-3">
		<div class="flex tabular-nums text-sm gap-x-1 shrink-0 items-center">
			<Input
				type="number"
				value={currentPage}
				on:blur={(e) => {
					currentPage = parseInt(e.target.value);
					renderPage(currentPage);
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
					renderPage(currentPage);
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
					renderPage(currentPage);
				}}
				size="sm"
				variant="ghost"
			>
				<ZoomOutIcon class="h-4 w-4" />
				<span class="sr-only">Zoom out</span>
			</Button>
		</div>
		<DropdownMenu>
			<DropdownMenuTrigger class={buttonVariants({ variant: 'ghost', size: 'sm' })}>
				<MoreHorizontalIcon size={16} />
			</DropdownMenuTrigger>
			<DropdownMenuContent placement="top-start" class="w-56">
				<DropdownMenuGroup>
					<DropdownMenuItem
						on:click={() => {
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
						Read as text
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
												post(`/tests/entry/${data.entry.id}?/relation`, {
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

<div
	class="grow h-[calc(100vh-6rem)] overflow-hidden relative min-w-[350px]"
	style:height="min({(viewport?.height * scale) / viewport_scale}px, 100%)"
>
	<!-- pdf content container -->
	<div class="absolute inset-0 min-w-[350px]">
		<!-- pdf viewer container -->
		<div bind:this={scroller} class="absolute overflow-auto border inset-0">
			<div bind:this={wrapper} id="article" style="--scale-factor: {scale};">
				<!-- floating toolbar -->
				{#if show_text_version}
					<div class="prose prose-stone space-y-4 whitespace-pre-line dark:prose-invert">
						{@html text}
					</div>
				{:else}
                {#each pages as page (page.pageNumber)}
                    <PdfPage on:rendered={() => {
                        console.log("rendered", page.pageNumber)
                    }} {page} bind:scale {annotations} />
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

	/* #svg-layer {

        margin-left: auto;
        margin-right: auto;
    } */
</style>
