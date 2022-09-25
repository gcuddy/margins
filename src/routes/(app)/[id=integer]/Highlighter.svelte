<script lang="ts">
	import { browser } from '$app/environment';
	import { match } from 'ts-pattern';
	import selection from '$lib/stores/selection';
	import { onDestroy, onMount } from 'svelte';
	import type { Annotation, Highlight } from '@prisma/client';
	import { highlightElements, layoutMode } from '$lib/stores/misc';
	import Tooltip from '$lib/components/Tooltip.svelte';
	import AnnotationsContainer from './_AnnotationsContainer.svelte';
	import type {
		AnnotationPos,
		NodeRef,
		SimplifiedHighlightSource,
		Tooltip as ITooltip,
	} from '$lib/types';
	// import sanitize from '$lib/sanitize';
	import { getSelectionHtml } from '$lib/utils';
	import { finder } from '@medv/finder';
	import HighlightToolTip from '$lib/components/HighlightToolTip.svelte';
	import { setUpLinkDragHandlers } from './_helpers';
	import ProseWrapper from '$lib/components/ProseWrapper.svelte';
	import { mainEl } from '$lib/stores/main';
	import { createTextQuoteSelectorMatcher, describeRange, describeTextQuote } from '$lib/annotator';
	import type { TextQuoteSelector } from '$lib/annotator/types';
	import { highlightText } from '$lib/annotator/highlighter';
	import { notifications } from '$lib/stores/notifications';
	import {
		AnnotationSchema,
		TargetSchema,
		TextQuoteSelectorSchema,
		TextQuoteTarget,
	} from '$lib/types/schemas/Annotations';
	import { page } from '$app/stores';
	import EditHighlightToolTip from '$lib/components/EditHighlightToolTip.svelte';
	import FloatingAnnotation from '$lib/components/annotations/FloatingAnnotation.svelte';
	import { fly } from 'svelte/transition';
	import { values } from 'idb-keyval';
	import { makeIconSvg } from '$lib/icons';
	import { syncStore } from '$lib/stores/sync';
	import type { z } from 'zod';
	export let articleID: number;
	export let articleUrl: string;
	export let annotations: Annotation[] = [];
	const idToRemoveMap = new Map<number, (() => void)[]>();
	$: console.log({ idToRemoveMap });
	let active_highlight_el: HTMLElement;
	let active_highlight_rect: DOMRect;
	let active_highlight_id: number | null = null;
	$: active_annotation = annotations.find(({ id }) => id === active_highlight_id);
	let annotation_opts: {
		el: HTMLElement;
		value: string;
		highlightInfo?: Awaited<ReturnType<typeof highlightSelectorTarget>>;
		selector: Awaited<TextQuoteSelector>;
	} | null = null;
	$: console.log({ annotation_opts });

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

	$: console.log({ annotations });
	console.log({ annotations });

	export let highlights: Highlight[] = [];

	// TODO: add more elements beyond just images, such as videos, iframes, etc.
	let images: HTMLImageElement[] = [];
	$: console.log({ images });

	let centerOfWrapper: number;

	let wrapper: HTMLElement;
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
		const { selection: sel } = val;
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

	// const highlightText = async () => {
	// 	console.log('highlighting');
	// 	const { html, nonTextNodes, range, selectors } = await processSelection(wrapper);
	// 	console.log({ selectors });
	// 	console.log({ html, nonTextNodes, range });
	// 	const textQuoteSelector = selectors.find((s) => s.type === 'TextQuoteSelector');
	// 	if (textQuoteSelector) {
	// 		const matches = createTextQuoteSelectorMatcher(textQuoteSelector)(document.body);
	// 		const matchList = [];
	// 		for await (const match of matches) matchList.push(match);
	// 		// create uuid and body
	// 		const uuid = uuidv4();
	// 		// or: optimistically mark, post highlight, return incremented id and then apply it
	// 		// should apply via /highlights/xx - maybe just /annotations/ - highlights just don't have bodies
	// 		// annotation with target that's just url is page note
	// 		highlight_uuids.push(uuid);
	// 		console.log({ matchList });
	// 		for (const match of matchList)
	// 			aHighlightText(match, 'mark', {
	// 				class: 'margins-highlight',
	// 				'data-uuid': uuid
	// 			});
	// 	}
	// 	let highlightBody: HighlightBody;
	// 	let id: string;
	// 	return;
	// 	if (html && range) {
	// 		if (!range.toString()) {
	// 			// we'll be here when we have a selection with no text
	// 			// could be an image or something else
	// 			if (!nonTextNodes.length) return;
	// 			id = uuidv4();
	// 			// we create our own highlight body without any text.
	// 			// we just need to make sure to filter these out when restoring
	// 			highlightBody = createHighlightBody(
	// 				{
	// 					id,
	// 					text: ''
	// 				},
	// 				html,
	// 				nonTextNodes
	// 			);
	// 		} else {
	// 			// we're here if the highlight contains text too
	// 			const newHighlight = highlighter.fromRange(range);
	// 			id = newHighlight.id;
	// 			highlightBody = createHighlightBody(newHighlight, html, nonTextNodes);
	// 		}
	// 		console.log({ highlightBody });
	// 		if (nonTextNodes.length) {
	// 			// wrap non-text nodes in a highlight class so we can style it, and give them a data-highlight-id
	// 			nonTextNodes.forEach((node) => {
	// 				if (node.$node) {
	// 					if (node.$node instanceof HTMLElement) wrapNonTextNode(node.$node, id);
	// 				}
	// 			});
	// 		}
	// 		pending_highlight = highlightBody;
	// 		postHighlight(articleID, highlightBody).then(() => {
	// 			pending_highlight = undefined;
	// 			window.getSelection()?.empty();
	// 			activeHighlightID = '';
	// 		});
	// 	}
	// 	// if (validSelection) {
	// 	// 	const selection = window.getSelection();
	// 	// 	const range = selection.getRangeAt(0);
	// 	// 	const newHighlight = highlighter.fromRange(range);
	// 	// 	const body = createHighlightBody(newHighlight, html);
	// 	// 	await postHighlight(articleID, body);
	// 	// 	selection.empty();
	// 	// 	activeHighlightID = '';
	// 	// }
	// };

	const removeNonTextNodes = (id: string) => {
		const nodes = document.querySelectorAll<HTMLElement>(`[data-highlight-id="${id}"]`);
		nodes.forEach((node) => unWrapNonTextNode(node, id));
	};

	const createAnnotation = async () => {
		// this is very finnicky, i don't understand why it can only properly read the html if it's called first thing, but it is what it is. I should look at it at some point, though, it's kind of a mess.

		alert('annotation!');

		// const html = getSelectionHtml();
		// const selection = window.getSelection();
		// tooltipVisible = false;
		// if (selection.isCollapsed) return;
		// const range = selection.getRangeAt(0);
		// const highlight = highlighter.fromRange(range);
		// pending_highlight = createHighlightBody(highlight, html);
		// // activeHighlightID = highlight.id;
		// annotationTooltip.visible = true;
		// // selection.empty()
	};

	const isHighlight = (target: HTMLElement) =>
		target.dataset &&
		target.dataset.annotationId &&
		annotations.some((a) => a.id === parseInt(target.dataset.annotationId as string));

	const isAnnotation = (target: HTMLElement) =>
		!target.closest('.floating-annotation') &&
		(target.closest('button[data-annotation-id]') as HTMLElement);

	function handleClick(e: MouseEvent) {
		const target = e.target as HTMLElement;
		console.log({ target });
		if (isHighlight(target)) {
			console.log('you clicked a highlight!');
			active_highlight_el = target;
			active_highlight_rect = target.getBoundingClientRect();
			active_highlight_id = parseInt(target.dataset.annotationId as string);
			highlightMenu = true;

			// console.log({ top });
			// if (top < 75) {
			// 	highlightMenuTop = bottom + $mainEl.scrollTop + 25;
			// } else {
			// 	console.log({ scrollTop: $mainEl.scrollTop });
			// 	highlightMenuTop = top + $mainEl.scrollTop - 25;
			// }
			// console.log({ highlightMenuTop });
			// highlightMenuLeft = left + width / 2 - 40;
			// activeHighlightID = target.dataset.uuid;
		} else {
			const annotationParent = isAnnotation(target);
			if (annotationParent) {
				console.log('annotation');
				// active_highlight_rect = annotationParent.getBoundingClientRect();
				active_highlight_id = parseInt(annotationParent.dataset.annotationId as string);
				const active_annotation = annotations.find((a) => a.id === active_highlight_id);
				const { selector } = TargetSchema.parse(active_annotation?.target);
				annotation_opts = {
					el: annotationParent,
					value: active_annotation?.body || '',
					selector,
				};
				// highlightMenu = true;
			}
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
	async function highlightSelectorTarget(
		textQuoteSelector: TextQuoteSelector,
		id?: number,
		attributes?: Record<string, string>,
		annotation = false
	) {
		if (!wrapper) return;
		const matches = createTextQuoteSelectorMatcher(textQuoteSelector)(wrapper);

		// Modifying the DOM while searching can mess up; see issue #112.
		// Therefore, we first collect all matches before highlighting them.
		const matchList = [];
		for await (const match of matches) matchList.push(match);
		console.log({ matchList });

		const annotationEl = document.createElement('button');
		annotationEl.className = 'annotation';
		annotationEl.style.position = 'relative';
		annotationEl.dataset.annotationId = id?.toString();
		annotationEl.dataset.annotation = annotation.toString();
		const svg = makeIconSvg('annotationSolid', 16, {
			class: 'inline annotation fill-current',
		});
		annotationEl.innerHTML = svg;

		// const uuid = uuidv4();
		// return array of functions that will remove the highlight
		return matchList.map((match) =>
			highlightText(
				match,
				'mark',
				{
					id: {
						string: `annotation-${id?.toString()}` || '',
						first: true,
					},
					'data-annotation-id': id?.toString() || '',
					...attributes,
				},
				annotation ? annotationEl : undefined
			)
		);
		for (const match of matchList) {
			highlightText(match, 'mark', {
				// 'data-uuid': uuid
			});
		}
		// return uuid so they can be removed if the highlight fails
		// return uuid;
	}

	onMount(async () => {
		if (browser && wrapper) {
			// load highlgihts
			for (const annotation of annotations.filter((a) => a.motivation !== 'describing')) {
				console.log({ annotation });
				try {
					const target = TextQuoteTarget.parse(annotation.target);
					console.log({ target });
					const { selector } = target as z.TypeOf<typeof TextQuoteTarget>;
					console.log({ selector });
					const h = await highlightSelectorTarget(
						selector,
						annotation.id,
						{
							'data-annotation': annotation.body ? 'true' : 'false',
						},
						annotation.body ? true : false
					);
					idToRemoveMap.set(
						annotation.id,
						h.map((h) => h.removeHighlights)
					);
				} catch (e) {
					console.error(e);
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

			const links = Array.from(wrapper.querySelectorAll('a'));
			setUpLinkDragHandlers(links, { url: articleUrl, id: articleID });
		}
	});
	onDestroy(() => {
		unsubscribeSelection();
		highlighter && highlighter.dispose();
	});
</script>

<div>
	<ProseWrapper bind:el={wrapper} on:click={handleClick} first_letter={true}>
		<slot />
	</ProseWrapper>

	<annotations>
		<!-- <AnnotationsContainer
			on:cancel={() => {
				highlighter.remove(activeHighlightID);
				activeHighlightID = '';
			}}
			{annotations}
			{annotationTooltip}
			{articleID}
			{activeHighlightID}
			bind:pending_highlight
		/> -->
	</annotations>
</div>
{#if tooltipVisible}
	<Tooltip
		visibility={validSelection ? 'visible' : 'hidden'}
		rect={$selection.rect}
		container={$mainEl}
	>
		<HighlightToolTip
			labels={true}
			on:annotate={async () => {
				const userSelection = window.getSelection()?.getRangeAt(0);
				console.log({ userSelection });
				if (!userSelection || userSelection.collapsed) return;
				const selector = await describeTextQuote(userSelection);
				console.log({ selector });
				const highlightInfo = await highlightSelectorTarget(
					selector,
					undefined,
					{
						'data-annotation': 'true',
					},
					true
				);
				const el = [...highlightInfo[highlightInfo.length - 1]?.highlightElements].pop();
				console.log({ highlightInfo });
				if (!el) return;
				annotation_opts = {
					el,
					value: '',
					highlightInfo,
					selector,
				};
				console.log({ annotation_opts });
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
					idToRemoveMap.set(
						annotation.id,
						highlightInfo.map((h) => h.removeHighlights)
					);
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
	</Tooltip>
{/if}

{#if annotation_opts !== null}
	<FloatingAnnotation
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
			const { selector, highlightInfo, el } = annotation_opts;
			const id = el.dataset.annotationId;
			console.log({ highlightInfo });
			const syncId = syncStore.addItem();
			annotation_opts = null;
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
					id: id && id !== 'undefined' ? parseInt(id) : undefined,
					body: value,
				}),
			});
			syncStore.removeItem(syncId);
			if (res.ok) {
				notifications.notify({
					type: 'success',
					message: `Annotation ${id ? 'updated' : 'created'}!`,
				});
				// and add id to the highlight
				const annotation = await res.json();
				console.log({ annotation });
				if (highlightInfo) {
					highlightInfo?.forEach((h) => {
						h.highlightElements.forEach((el) => {
							console.log({ el });
							el.setAttribute('id', `annotation-${annotation.id}`);
							el.setAttribute('data-annotation-id', annotation.id);
						});
					});
					idToRemoveMap.set(
						annotation.id,
						highlightInfo.map((h) => h.removeHighlights)
					);
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
{/if}

{#if highlightMenu}
	<Tooltip
		rect={active_highlight_rect}
		container={$mainEl}
		visibility={highlightMenu ? 'visible' : 'hidden'}
		on:clickOutside={() => (highlightMenu = false)}
	>
		<EditHighlightToolTip
			on:delete={async () => {
				if (active_highlight_id === null) return;
				const removeHighlights = idToRemoveMap.get(active_highlight_id);
				removeHighlights && removeHighlights.forEach((remove) => remove());
				highlightMenu = false;
				idToRemoveMap.delete(active_highlight_id);
				annotations = annotations.filter((a) => a.id !== active_highlight_id);
				const res = await fetch(`/annotations/${active_highlight_id}`, {
					method: 'DELETE',
					headers: {
						'Content-Type': 'application/json',
					},
				});
				if (res.ok) {
					notifications.notify({
						type: 'success',
						message: 'Highlight deleted!',
					});
				} else {
					notifications.notify({
						type: 'error',
						message: 'Highlight deletion failed!',
					});
				}
				//todo
			}}
			on:edit={() => {
				highlightMenu = false;
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
	</Tooltip>
{/if}

<style lang="postcss">
	:global(mark) {
		scroll-padding-top: 100px;
	}
	:global(mark[data-annotation-id]) {
		cursor: pointer;
		@apply relative animate-saturate-pulse scroll-mt-48 rounded-sm border-b-2 border-yellow-400 bg-yellow-200 transition dark:border-yellow-500 dark:bg-yellow-900/90 dark:text-amber-50;
		/* maybe broder should just be applied if there's an annotation attached */
	}
	:global(mark[data-annotation-id].active) {
		@apply bg-yellow-400 dark:bg-yellow-500;
	}
	:global(.dark mark[id]) {
		@apply bg-yellow-200/20 text-amber-200;
	}
</style>
