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
	import { onMount, tick } from 'svelte';
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
	import { get_pdf_text } from '$lib/utils/pdf';
	import toast from 'svelte-french-toast';
	import { useCommanderContext } from '../../../Commander.svelte';
	import { getCommanderContext } from '$lib/commands/GenericCommander.svelte';
	import JumpToEntry from '$lib/commands/JumpToEntry.svelte';
	import { post } from '$lib/utils/forms';
	export let data: PageData;

	let thumbnails = [];

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
		const pdf_path = data.S3_BUCKET_PREFIX + data.entry.uri;
		console.log({ pdf_path });
		// Load the PDF document
		const loadingTask = getDocument(pdf_path);
		pdfDocument = await loadingTask.promise;
		totalPages = pdfDocument.numPages;

		console.log(await pdfDocument.getMetadata());
		console.log(pdfDocument);
		// Render the initial page
		await renderPage(currentPage);
	}

	onMount(async () => {
		// await import??
		loadPDF();
	});
	// afterUpdate(loadPDF);

	let scale = 2;

	async function renderPage(pageNumber: number) {
		const page = await pdfDocument.getPage(pageNumber);
		viewport = page.getViewport({ scale });
		const context = canvas.getContext('2d');
		if (!context) throw new Error('Could not get canvas context');
		canvas.height = viewport.height;
		canvas.width = viewport.width;

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

		const h = await highlightSelectorTarget(text_quote_selector);
		const id = nanoid();

		highlights = [
			...highlights,
			{
				highlightElements: h.flatMap((h) => h.highlightElements).map(calculate_h),
				pageNumber: currentPage,
				id
			}
		];

		window.getSelection()?.removeAllRanges();

		return target;
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
		class="inset-x-0 mx-auto flex w-min items-center justify-center gap-x-4 rounded-md bg-popover/80 p-4 backdrop-blur-md"
	>
		<Button on:click={goToPreviousPage} disabled={currentPage === 1}>
			<ChevronLeftIcon size={16} />
			<span class="sr-only">Back</span>
		</Button>
		<Button on:click={goToNextPage} disabled={currentPage === totalPages}>
			<span class="sr-only">Next</span>
			<ChevronRightIcon size={16} />
		</Button>

		<Button
			on:click={() => {
				scale += 0.25;
				renderPage(currentPage);
			}}
		>
			<ZoomInIcon size={16} />
			<span class="sr-only">Zoom in</span>
		</Button>
		<Button
			on:click={() => {
				scale -= 0.25;
				renderPage(currentPage);
			}}
		>
			<ZoomOutIcon size={16} />
			<span class="sr-only">Zoom out</span>
		</Button>

		<DropdownMenu>
			<DropdownMenuTrigger class={buttonVariants()}>
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
											).finally(() => {
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

<Selection
	on:highlight={async ({ detail }) => {
		const { form, el } = detail;
		const target = await highlight();
		if (!target) return;
		form.update(($form) => {
			return {
				...$form,
				target
			};
		});
		el.requestSubmit();
	}}
/>

<div class="overflow-auto">
	<div bind:this={wrapper} id="article" style="--scale-factor: {scale};">
		<!-- floating toolbar -->
		{#if show_text_version}
			<div class="prose prose-stone space-y-4 whitespace-pre-line dark:prose-invert">
				{@html text}
			</div>
		{:else}
			<div class="relative">
				{#key scale}
					<svg
						id="svg-layer"
						style:width="{viewport?.width}px"
						style:height="{viewport?.height}px"
						class="absolute inset-0 h-full w-full overflow-hidden mix-blend-multiply"
					>
						{#each highlights.filter((h) => h.pageNumber === currentPage) as highlight}
							{#each highlight.highlightElements as highlightElement}
								{@const parent = highlightElement.element.parentElement}
								{#if highlightElement && parent}
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
				{/key}
				<div class="absolute inset-0" bind:this={text_layer} id="text-layer" />
				<canvas bind:this={canvas} id="pdf-canvas" />
			</div>
		{/if}
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
