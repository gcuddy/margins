<script lang="ts">
	import { browser } from '$app/environment';
	import Tooltip from '$lib/components/Tooltip.svelte';
	import { highlightElements } from '$lib/stores/misc';
	import selection from '$lib/stores/selection';
	import selectionAction from '$lib/actions/selection';
	import type {
		AnnotationPos,
		NodeRef,
		SimplifiedHighlightSource,
		Tooltip as ITooltip,
	} from '$lib/types';
	import type { Annotation, Tag } from '@prisma/client';
	import { onDestroy, onMount } from 'svelte';
	// import sanitize from '$lib/sanitize';
	import { page } from '$app/stores';
	import {
		createTextQuoteSelectorMatcher,
		describeRange,
		describeSelection,
		describeTextQuote,
	} from '$lib/annotator';
	import { highlightText } from '$lib/annotator/highlighter';
	import type {
		CssSelector,
		RangeSelector,
		TextPositionSelector,
		TextQuoteSelector,
	} from '$lib/annotator/types';
	import FloatingAnnotation from '$lib/components/annotations/FloatingAnnotation.svelte';
	import EditHighlightToolTip from '$lib/components/EditHighlightToolTip.svelte';
	import Icon from '$lib/components/helpers/Icon.svelte';
	import HighlightToolTip from '$lib/components/HighlightToolTip.svelte';
	import ProseWrapper from '$lib/components/ProseWrapper.svelte';
	import { makeIconSvg } from '$lib/icons';
	import { mainEl } from '$lib/stores/main';
	import { notifications } from '$lib/stores/notifications';
	import { syncStore } from '$lib/stores/sync';
	import type { TextQuoteTarget } from '$lib/types/schemas/Annotations';
	import { TargetSchema, type Selector } from '$lib/annotation';
	import { finder } from '@medv/finder';
	import { createPopperActions } from 'svelte-popperjs';
	import type { z } from 'zod';
	import { setUpLinkDragHandlers } from './_helpers';
	import ContextMenu from '$lib/components/ContextMenu.svelte';
	import { MenuButton } from '@rgossiaux/svelte-headlessui';
	import { fade, fly, crossfade, scale } from 'svelte/transition';
	import { derived, writable } from 'svelte/store';
	import TooltipMenu from '$lib/components/TooltipMenu.svelte';
	import AnnotationInput from '$lib/components/annotations/AnnotationInput.svelte';
	import { nodeFromXPath, xpathFromNode } from '$lib/annotator/xpath';
	import { buildSelectorFromImage } from '$lib/annotator/img';
	import { makeCreateRangeSelectorMatcher } from '$lib/annotator/range';
	import { upsertAnnotation } from '$lib/annotation';
	import { portal } from 'svelte-portal';
	import Annotation from '$lib/components/Annotation.svelte';
	import type { EntryWithBookmark } from '$lib/entry.server';
	import parse from 'node-html-parser/dist/parse';
	const [send, receive] = crossfade({
		duration: 150,
		fallback: scale,
	});
	const [menuRef, menuContent] = createPopperActions({
		placement: 'top',
		strategy: 'fixed',
		modifiers: [
			{
				name: 'preventOverflow',
				options: {
					padding: {
						top: 75,
					},
				},
			},
			{
				name: 'offset',
				options: {
					offset: [0, 16],
				},
			},
		],
	});
	const [annotationMenuRef, annotationMenuContent] = createPopperActions({
		placement: 'top',
		strategy: 'absolute',
		modifiers: [
			{
				name: 'preventOverflow',
				options: {
					padding: {
						top: 75,
					},
				},
			},
			{
				name: 'offset',
				options: {
					offset: [0, 8],
				},
			},
		],
	});
	const [popperRef, popperContent] = createPopperActions({
		placement: 'right',
		modifiers: [
			{
				name: 'offset',
				options: {
					offset: [-2, 0],
				},
			},
		],
	});
	const [imageTooltipRef, imageTooltipContent] = createPopperActions({
		placement: 'top-end',
		modifiers: [
			{
				name: 'offset',
				options: {
					offset: [-25, -50],
				},
			},
		],
	});
	export let articleID: number;
	$: console.log({ articleID });
	export let articleUrl: string;
	export let annotations: Annotation[] = [];
	export let readOnly = false;

	// Virtual Selection Element to track selection for annotation menu
	let show_tooltip = false;
	let tooltip_display: TooltipDisplay;
	let annotationContainer: HTMLElement;
	let rect: DOMRect = {
		x: 0,
		y: 0,
		bottom: 0,
		top: 0,
		width: 0,
		height: 0,
	} as DOMRect;
	$: getBoundingClientRect = () => {
		return {
			width: rect.width,
			height: rect.height,
			top: rect.top,
			bottom: rect.bottom,
			left: rect.x,
			right: rect.x,
		};
	};
	const virtualElement = writable({ getBoundingClientRect });
	$: $virtualElement = { getBoundingClientRect };
	menuRef(virtualElement);

	let destroy_popper: (() => void) | undefined;
	let show_link_tooltip = false;
	let show_image_tooltip = false;
	let destroy_image_tooltip: typeof destroy_popper;

	function cleanup() {
		if (destroy_image_tooltip) destroy_image_tooltip();
		if (destroy_popper) destroy_popper();
	}
	let link_tooltip_button: HTMLElement;

	// todo: should this be a reactive store?
	const idToElMap = new Map<number, { destroy: (() => void)[]; els: HTMLElement[] }>();
	const annotation_els = writable<Record<number, HTMLElement>>();
	$: inlineAnnotations = annotations.filter((a) => a.type === 'annotation');
	$: annotationsWithBodyOrTag = inlineAnnotations.filter((a) => a.body || a.tags?.length);

	let active_highlight_el: HTMLElement;
	let active_highlight_rect: DOMRect;
	let active_highlight_id: number | null = null;
	$: active_annotation = annotations?.find(({ id }) => id === active_highlight_id);
	let active_annotation_tags: Tag[] = [];
	$: console.log({ active_annotation_tags });
	let annotation_opts: {
		el: HTMLElement;
		value: string;
		html?: string;
		annotation: Annotation;
		highlightInfo?: Awaited<ReturnType<typeof highlightSelectorTarget>>;
		selector: Awaited<TextQuoteSelector>;
		tags?: { name: string; id?: number }[];
	} | null = null;
	$: console.log({ annotation_opts });

	const createTextQuoteMatcher = (selector: TextQuoteSelector) => {
		return () => createTextQuoteSelectorMatcher(selector);
	};
	// Not sure if this is a performant way to do this...
	function updateActiveAnnotation() {
		wrapper.querySelectorAll(`[data-annotation-id="${active_highlight_id}"]`)?.forEach((el) => {
			el.classList.add('active');
		});
		// remove active class from all other annotations
		Array.from(wrapper.querySelectorAll('[data-annotation-id]')).forEach((el) => {
			if (el.dataset.annotationId !== active_highlight_id?.toString()) {
				el.classList.remove('active');
			}
		});
	}

	$: active_highlight_id, wrapper && updateActiveAnnotation();

	// TODO: add more elements beyond just images, such as videos, iframes, etc.
	let images: HTMLImageElement[] = [];
	$: console.log({ images });

	let centerOfWrapper: number;

	let wrapper: HTMLElement;
	let wrapper_dimensions: DOMRect;
	$: console.log({ wrapper_dimensions });
	let highlighter: Highlighter;
	let validSelection = false;

	const highlight_ids: number[] = [];

	let pending_highlight: HighlightBody | undefined;

	const annotationTooltip: ITooltip = {
		visible: false,
		top: 0,
	};

	let highlightMenu = false;
	let highlightMenuTop = 0;
	let highlightMenuLeft = 0;

	let tooltipVisible = false;
	let tooltipTop = 0;
	let tooltipLeft = 0;

	const isValidSelection = (sel: Selection) =>
		sel &&
		!sel.isCollapsed &&
		sel.rangeCount > 0 &&
		sel.containsNode(wrapper, true) &&
		!sel.anchorNode.parentElement.closest('mark[data-annotation-id]') &&
		!sel.focusNode.parentElement.closest('mark[data-annotation-id]');

	const unsubscribeSelection = selection.subscribe((val) => {
		if (!val) return;
		if (!wrapper) return;
		if (!$page.data.AUTHORIZED) return;
		const { selection: sel } = val;
		return;
		if (sel && isValidSelection(sel)) {
			validSelection = true;
			tooltipVisible = true;
		} else {
			validSelection = false;
			tooltipVisible = false;
		}
		if (validSelection && val.rect) {
			console.log({ scrollY: window.scrollY, rect: val.rect });
			console.log({ $mainEl });
			tooltipTop = val.rect.top + $mainEl.scrollTop - 36;
			console.log({ tooltipTop });
			tooltipLeft = val.rect.left + val.rect.width / 2 - 40;
			annotationTooltip.top = val.rect.top + $mainEl.scrollTop;
		}
	});
	$: console.log({ $mainEl });

	enum TooltipDisplay {
		New,
		Edit,
	}
	const createHighlightBody = (
		highlight: SimplifiedHighlightSource,
		input: Range | string,
		nonTextNodes: NodeRef[] = []
	) => {
		console.log('creating highlight body');
		const highlightBody: HighlightBody = {
			articleID,
			highlight,
			// sanitizedHtml: sanitize(input),
			nonTextNodes,
		};
		return highlightBody;
	};

	const preventDefault = (e: Event) => e.preventDefault();

	const wrapNonTextNode = (element: HTMLElement, highlightId: string) => {
		// const wrapper = document.createElement('div');
		// wrapper.classList.add('highlight-node');
		// wrapper.dataset.highlightId = highlightId;
		// element.parentNode.insertBefore(wrapper, element);
		// wrapper.appendChild(element);
		// return wrapper;
		// wrapping seems to have weird behavior, so we just use the element itself
		element.dataset.highlightId = highlightId;
		element.classList.add('highlight-node');
		element.addEventListener('click', preventDefault);
	};
	const unWrapNonTextNode = (element: HTMLElement, highlightId: string) => {
		element.dataset.highlightId = '';
		element.classList.remove('highlight-node');
		element.removeEventListener('click', preventDefault);
	};

	const restoreHighlightedNonTextNode = (node: NonTextNode, highlightId: string) => {
		let element: HTMLElement;
		element = document.querySelector(node.selector);
		if (!element) element = document.getElementsByTagName(node.tagName)[node.index] as HTMLElement;
		if (!element) {
			throw Error(`Could not find element with selector ${node.selector}`);
		}
		// element.dataset.highlightId = highlightId;
		// element.classList.add('highlight-node');
		wrapNonTextNode(element, highlightId);
	};

	const removeNonTextNodes = (id: string) => {
		const nodes = document.querySelectorAll<HTMLElement>(`[data-highlight-id="${id}"]`);
		nodes.forEach((node) => unWrapNonTextNode(node, id));
	};

	const isHighlight = (target: HTMLElement) =>
		target.dataset &&
		target.dataset.annotationId &&
		annotations.some((a) => a.id === parseInt(target.dataset.annotationId as string));

	const isAnnotation = (target: HTMLElement) =>
		!target.closest('.floating-annotation') &&
		(target.closest('[data-annotation-id]') as HTMLElement) &&
		target.tagName !== 'BUTTON';

	function handleClick(e: MouseEvent) {
		if (!$page.data.AUTHORIZED) return;
		const el = e.target as HTMLElement;
		const annotationParent = isAnnotation(el);
		if (annotationParent) {
			console.log('annotation');
			// active_highlight_rect = annotationParent.getBoundingClientRect();
			active_highlight_el = el;
			active_highlight_id = parseInt(el.dataset.annotationId as string);
			rect = el.getBoundingClientRect();
			const active_annotation = annotations.find((a) => a.id === active_highlight_id);
			const tags = active_annotation?.tags?.flatMap((t) => t.tag) || [];
			console.log({ tags });
			active_annotation_tags = tags;
			const { selector } = TargetSchema.parse(active_annotation?.target);
			tooltip_display = TooltipDisplay.Edit;
			show_tooltip = true;
			// annotation_opts = {
			// 	el: annotationParent,
			// 	value: (active_annotation?.body as string) || '',
			// 	selector,
			// };
		} else if (annotation_opts === null) {
			active_highlight_id = null;
		}
	}

	const createFloatingAnnotation = (top: number, el: HTMLElement) => {
		console.log({ top });
		annotationTooltip.top = top;
		annotationTooltip.visible = true;

		const floatingAnnotation: AnnotationPos = {
			pos: top / wrapper.getBoundingClientRect().height,
			node: {
				tagName: el.tagName,
				index: Array.from(wrapper.getElementsByTagName(el.tagName)).indexOf(el),
				selector: finder(el),
			},
		};
		console.log({ floatingAnnotation });
	};

	const updateHighlightElements = () => highlightElements.set(highlighter.getDoms());

	async function describeCurrentSelection() {
		const userSelection = window.getSelection()?.getRangeAt(0);
		if (!userSelection || userSelection.collapsed) return;
		return await describeTextQuote(userSelection);
	}
	const highlight: typeof highlightText = (match, tagName = 'mark', attributes) => {
		return highlightText(match, tagName, {
			...attributes,
		});
	};
	const createMatcher = (selector: Selector) => {
		const innerCreateMatcher = {
			TextQuoteSelector: createTextQuoteSelectorMatcher,
			RangeSelector: makeCreateRangeSelectorMatcher(createMatcher as any),
			XPathSelector: null,
		}[selector.type];
		if (!innerCreateMatcher) {
			throw new Error(`Unsupported selector type: ${selector.type}`);
		}
		return innerCreateMatcher(selector);
	};
	async function highlightSelectorTarget(
		textQuoteSelector: TextQuoteSelector,
		id?: number,
		attributes?: Record<string, string>,
		annotation = false
	) {
		const matches = createTextQuoteSelectorMatcher(textQuoteSelector)(wrapper);

		// Modifying the DOM while searching can mess up; see issue #112.
		// Therefore, we first collect all matches before highlighting them.
		const matchList = [];
		for await (const match of matches) matchList.push(match);
		console.log({ matchList });
		return matchList.map((match) =>
			highlight(match, 'mark', {
				'data-annotation-id': id?.toString() || '',
				...attributes,
			})
		);
	}

	const makeHTMLFromRange = (range: Range): string => {
		const cloned = range.cloneContents();
		const div = document.createElement('div');
		div.appendChild(cloned);
		return div.outerHTML;
		// could also return inner, but I like having the wrapping div
	};
	const tryToWrapOnServer = async () => {
		for (const annotation of inlineAnnotations) {
			console.log({ annotation });
			try {
				const target = TargetSchema.parse(annotation.target);
				console.log({ target });
				const { selector } = target;
				const matches = createMatcher(selector)(wrapper);
				const matchList = [];
				for await (const match of matches) matchList.push(match);
				const h = matchList.map((match) =>
					highlight(match, 'mark', {
						'data-annotation-id': annotation.id.toString(),
						'data-annotation-content': annotation.body || annotation.tags.length ? 'true' : 'false',
					})
				);
				$annotation_els = { ...$annotation_els, [annotation.id]: h[0].highlightElements[0] };
				idToElMap.set(annotation.id, {
					destroy: h.map((h) => h.removeHighlights),
					els: h.flatMap((h) => h.highlightElements),
				});
			} catch (e) {
				// console.error(e);
			}
		}
	};
	onMount(async () => {
		if (browser && wrapper) {
			// load highlgihts
			for (const annotation of inlineAnnotations) {
				console.log({ annotation });
				try {
					const target = TargetSchema.parse(annotation.target);
					console.log({ target });
					const { selector } = target;
					const matches = createMatcher(selector)(wrapper);
					const matchList = [];
					for await (const match of matches) matchList.push(match);
					const h = matchList.map((match) =>
						highlight(match, 'mark', {
							'data-annotation-id': annotation.id.toString(),
							'data-annotation-content':
								annotation.body || annotation.tags.length ? 'true' : 'false',
						})
					);
					$annotation_els = { ...$annotation_els, [annotation.id]: h[0].highlightElements[0] };
					idToElMap.set(annotation.id, {
						destroy: h.map((h) => h.removeHighlights),
						els: h.flatMap((h) => h.highlightElements),
					});
				} catch (e) {
					// console.error(e);
				}
			}
			// TODO: eventually this will be ssr-d so we'll be able to go to annotation without js, just a #annotation-{ID} link
			const a = $page.url.searchParams.get('a');
			if (a && wrapper) {
				console.log('a', a);
				// go to the annotation
				setTimeout(() => {
					const el = wrapper.querySelector(`#annotation-${a}`);
					el?.scrollIntoView({
						block: 'center',
					});
				}, 0);
			}
			if ($page.data.AUTHORIZED) {
				const links = Array.from(wrapper.querySelectorAll('a'));
				// setUpLinkDragHandlers(links, { url: articleUrl, id: articleID });
			}
		}
	});
	onDestroy(() => {
		unsubscribeSelection();
		highlighter && highlighter.dispose();
	});
</script>

<div
	on:mouseleave={() => {
		// cleanup();
	}}
	on:mouseover={(e) => {
		if (destroy_popper) {
			// cleanup
			destroy_popper();
			destroy_popper = undefined;
		}
		if (!(e.target instanceof HTMLElement)) {
			show_link_tooltip = false;
			return;
		}
		if (e.target?.tagName === 'A') {
			const el = e.target;
			setTimeout(() => {
				show_link_tooltip = true;
				const { destroy } = popperRef(el);
				destroy_popper = destroy;
			}, 150);
			// createPopper(e.target, link_tooltip_button, {
			// 	placement: 'right-end',
			// });
			console.log('Trigger hover');
		} else {
			show_link_tooltip = false;
		}
		if (destroy_image_tooltip) {
			destroy_image_tooltip();
			destroy_image_tooltip = undefined;
		}
		if (e.target?.tagName === 'IMG') {
			const el = e.target;
			show_image_tooltip = true;
			const { destroy } = imageTooltipRef(el);
			destroy_image_tooltip = destroy;
		}
	}}
	use:selectionAction={{
		cb: (sel) => {
			if (sel.isCollapsed) {
				show_tooltip = false;
				// sel.anchorNode?.parentElement?.closest('[data-annotation-entry]');
			} else {
				if (sel) {
				}
				show_tooltip = true;
				tooltip_display = TooltipDisplay.New;
				rect = sel.getRangeAt(0).getBoundingClientRect();
			}
		},
		scrollEl: $mainEl,
	}}
	on:focus
>
	{#if show_tooltip}
		<div class="z-40" use:menuContent>
			<TooltipMenu>
				{#if tooltip_display === TooltipDisplay.New}
					<HighlightToolTip
						labels={true}
						on:annotate={async () => {
							const userSelection = window.getSelection();
							if (!userSelection) return;
							const userRange = userSelection.getRangeAt(0);
							const html = makeHTMLFromRange(userRange);
							console.log({ userSelection: userRange });
							if (!userRange || userRange.collapsed) return;
							const selector = await describeTextQuote(userRange);
							console.time('described');
							const described = await describeSelection(userRange, wrapper);
							console.timeEnd('described');
							console.log({ described });
							if (described?.type === 'TextQuoteSelector') {
								const highlightInfo = await highlightSelectorTarget(
									selector,
									undefined,
									{
										'data-annotation': 'true',
										'data-annotation-id': 'undefined',
										'data-annotation-content': 'true',
									},
									true
								);
								const el = [...highlightInfo[highlightInfo.length - 1]?.highlightElements].pop();
								console.log({ highlightInfo });
								if (!el) return;
								// rect = el.getBoundingClientRect();
								annotationMenuRef(el);
								annotation_opts = {
									el,
									value: '',
									highlightInfo,
									selector,
									html,
								};
							} else if (described?.type === 'RangeSelector') {
								// TODO: allow other matchers besides text quote and fix type error
								const createRangeSelectorMatcher = makeCreateRangeSelectorMatcher(
									createTextQuoteSelectorMatcher
								);
								const match = createRangeSelectorMatcher(described)(wrapper);
								const matches = [];
								for await (const range of match) {
									matches.push(range);
								}
								const highlightInfo = matches.map((match) => highlight(match));
								const el = [...highlightInfo[highlightInfo.length - 1]?.highlightElements].pop();
								console.log({ highlightInfo });
								if (!el) return;
								// rect = el.getBoundingClientRect();
								annotationMenuRef(el);
								annotation_opts = {
									el,
									value: '',
									highlightInfo,
									selector,
								};
							} else if (described?.type === 'XPathSelector') {
								const node = nodeFromXPath(described.value);
								console.log({ node });
								if (node) {
									const highlightInfo = highlight(node);
									const el = [...highlightInfo.highlightElements].pop();
									if (!el) return;
									annotationMenuRef(el);
									annotation_opts = {
										el,
										value: '',
									};
								}
							}
						}}
						on:highlight={async () => {
							const userSelection = window.getSelection()?.getRangeAt(0);
							console.log({ userSelection });
							describeRange(userSelection, wrapper);
							if (!userSelection || userSelection.collapsed) return;
							const selector = await describeTextQuote(userSelection);
							console.log({ selector });
							const highlightInfo = await highlightSelectorTarget(selector);
							window.getSelection()?.removeAllRanges();
							// todo: add pending state so that the highlight gets removed if it fails

							console.log({ selector });
							const res = await fetch('/annotations', {
								method: 'POST',
								headers: {
									'Content-Type': 'application/json',
								},
								body: JSON.stringify({
									// jfc let's fix this
									articleId: articleID,
									target: {
										source: articleUrl,
										selector,
									},
								}),
							});
							if (res.ok) {
								notifications.notify({
									type: 'success',
									message: 'Highlight created!',
								});
								// and add id to the highlight
								const annotation = await res.json();
								console.log({ annotation });
								highlightInfo.forEach((h) => {
									h.highlightElements.forEach((el) => {
										el.setAttribute('id', `annotation-${annotation.id}`);
										el.setAttribute('data-annotation-id', annotation.id);
									});
								});
								idToElMap.set(annotation.id, {
									destroy: highlightInfo.map((h) => h.removeHighlights),
									els: highlightInfo.flatMap((h) => h.highlightElements),
								});
								annotations = [...annotations, annotation];
							} else {
								notifications.notify({
									type: 'error',
									message: 'Highlight failed!',
								});
								highlightInfo.forEach((h) => {
									h.removeHighlights();
								});
							}
						}}
					/>
				{:else if tooltip_display === TooltipDisplay.Edit}
					<EditHighlightToolTip
						on:delete={async () => {
							console.log({ active_highlight_id });
							if (active_highlight_id === null) return;
							const removeHighlights = idToElMap.get(active_highlight_id);
							removeHighlights && removeHighlights.destroy.forEach((remove) => remove());
							console.log({ removeHighlights });
							// clean up button
							document
								.querySelectorAll(`[data-annotation-id="${active_highlight_id}"]`)
								?.forEach((el) => {
									el.remove();
								});
							highlightMenu = false;
							idToElMap.delete(active_highlight_id);
							annotations = annotations.filter((a) => a.id !== active_highlight_id);
							const res = await fetch(`/api/annotations/${active_highlight_id}`, {
								method: 'DELETE',
								headers: {
									'Content-Type': 'application/json',
								},
							});
							console.log({ res });
							if (res.status === 204) {
								notifications.notify({
									type: 'success',
									title: 'Highlight deleted',
									message: 'Undo?',
								});
							}
						}}
						on:edit={() => {
							show_tooltip = false;
							const target = TargetSchema.parse(active_annotation?.target);
							if (typeof target === 'string') return;
							annotation_opts = {
								el: active_highlight_el,
								value: active_annotation?.body || '',
								selector: target.selector,
							};
						}}
						annotation={active_annotation}
						on:annotate={() => {
							highlightMenu = false;
							const target = TargetSchema.parse(active_annotation?.target);
							if (typeof target === 'string') return;
							annotation_opts = {
								el: active_highlight_el,
								value: active_annotation?.body || '',
								selector: target.selector,
							};
						}}
					/>
				{/if}
			</TooltipMenu>
		</div>
	{/if}
	{#if annotation_opts !== null}
		<div
			bind:this={annotationContainer}
			data-annotation-entry
			in:receive={{ key: active_annotation?.id }}
			out:send={{ key: active_annotation?.id }}
		>
			<FloatingAnnotation
				bind:tags={active_annotation_tags}
				on:cancel={() => {
					if (!annotation_opts) return;
					console.log({ annotation_opts });
					annotation_opts.highlightInfo?.forEach((h) => {
						h.removeHighlights();
					});
					annotation_opts = null;
				}}
				on:save={async (e) => {
					const { value } = e.detail;
					console.log({ annotation_opts });
					if (!annotation_opts) return;
					if (!$page.data.user) return;
					const { selector, highlightInfo, el } = annotation_opts;
					const id = el.dataset.annotationId;
					const annotation = await upsertAnnotation({
						body: value,
						target: {
							source: articleUrl,
							selector,
							html: annotation_opts.html,
						},
						userId: $page.data.user.userId,
						entryId: articleID,
						id: (id && Number(id)) || Number(id) === 0 ? Number(id) : undefined,
						tags: active_annotation_tags,
					});
					const syncId = syncStore.addItem();
					annotation_opts = null;
					syncStore.removeItem(syncId);
					if (annotation) {
						notifications.notify({
							type: 'success',
							message: `Annotation ${id ? 'updated' : 'created'}!`,
						});
						// and add id to the highlight
						// const annotation = await res.json();
						console.log({ annotation });
						if (highlightInfo) {
							console.log({ highlightInfo });
							highlightInfo?.forEach((h) => {
								h.highlightElements.forEach((el) => {
									console.log({ el });
									el.setAttribute('id', `annotation-${annotation.id}`);
									el.setAttribute('data-annotation-id', annotation.id.toString());
								});
							});
							$annotation_els = {
								...$annotation_els,
								[annotation.id]: highlightInfo[0].highlightElements[0],
							};
							idToElMap.set(annotation.id, {
								destroy: highlightInfo.map((h) => h.removeHighlights),
								els: highlightInfo.flatMap((h) => h.highlightElements),
							});
						}
						annotations = [...annotations, annotation];
					} else {
						notifications.notify({
							type: 'error',
							message: 'Highlight failed!',
						});
						highlightInfo?.forEach((h) => {
							h.removeHighlights();
						});
					}
				}}
				{...annotation_opts}
			/>
		</div>
	{/if}
	<ProseWrapper
		bind:dimensions={wrapper_dimensions}
		bind:el={wrapper}
		on:click={handleClick}
		first_letter={false}
	>
		<div
			on:dragstart={(e) => {
				if (e.target instanceof HTMLAnchorElement) {
					// set context data
					console.log({ articleUrl, articleID });
					e.dataTransfer?.setData('context/url', articleUrl);
					e.dataTransfer?.setData('context/entryId', articleID.toString());
				}
			}}
		>
			<slot />
		</div>
	</ProseWrapper>
	<annotations>
		{#each annotationsWithBodyOrTag as annotation}
			<!-- use:portal={idToElMap.get(annotation.id)?.els[0]} -->
			{@const el = $annotation_els?.[annotation.id]}
			{#if el}
				{@const el_rect = el.getBoundingClientRect()}
				<button
					style:left="calc({el_rect.left - wrapper_dimensions.left} * -1px - 24px)"
					in:receive={{ key: annotation.id }}
					out:send={{ key: annotation.id }}
					use:portal={el}
					class="absolute top-0 hidden h-4 w-4 cursor-default rounded bg-amber-400/80 backdrop-blur-md sm:block"
					on:click={() => {
						active_highlight_id = annotation.id;
						const active_annotation = annotations.find((a) => a.id === active_highlight_id);
						const tags = active_annotation?.tags?.flatMap((t) => t.tag) || [];
						active_annotation_tags = tags;
						annotation_opts = {
							el,
							selector: annotation.target.selector,
							value: annotation.body,
							annotation,
						};
					}}><span class="sr-only">Open annotation</span></button
				>
			{/if}
		{/each}
	</annotations>
</div>
{#if show_image_tooltip}
	<div use:imageTooltipContent>
		<ContextMenu
			strategy="absolute"
			items={[
				[
					{
						icon: 'academicCap',
						label: 'save',
					},
				],
			]}
			active_styling={false}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="h-10 w-10 fill-black/25 stroke-amber-500"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
				/>
			</svg>
		</ContextMenu>
	</div>
{/if}
{#if show_link_tooltip}
	<div use:popperContent bind:this={link_tooltip_button}>
		<div transition:fade={{ duration: 150 }}>
			<ContextMenu
				strategy="fixed"
				items={[
					[
						{
							icon: 'academicCap',
							label: 'save',
						},
					],
				]}
				active_styling={false}
				class=""
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="h-6 w-6 fill-gray-500 stroke-black"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
			</ContextMenu>
		</div>
	</div>
{/if}

<style lang="postcss">
	:global(mark) {
		scroll-padding-top: 100px;
	}
	:global(mark[data-annotation-id]) {
		cursor: pointer;
		@apply relative animate-saturate-pulse scroll-mt-48 rounded-sm bg-yellow-200 transition dark:border-yellow-500 dark:bg-yellow-900/90 dark:text-amber-50;
		/* maybe broder should just be applied if there's an annotation attached */
	}
	:global(mark[data-annotation-id][data-annotation-content='true']) {
		@apply border-b-2 border-yellow-400;
	}
	:global(mark[data-annotation-id].active) {
		@apply bg-yellow-400 dark:bg-yellow-500;
	}
	:global(.dark mark[id]) {
		@apply bg-yellow-200/20 text-amber-200;
	}
	:global(mark[data-annotation-id] img) {
		@apply border-4 border-primary-400;
	}
</style>
