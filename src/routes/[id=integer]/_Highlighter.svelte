<script lang="ts">
	import { browser } from '$app/env';
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
		Tooltip as ITooltip
	} from '$lib/types';
	// import sanitize from '$lib/sanitize';
	import { getSelectionHtml } from '$lib/utils';
	import { finder } from '@medv/finder';
	import HighlightToolTip from '$lib/components/HighlightToolTip.svelte';
	import { setUpLinkDragHandlers } from './_helpers';
	import ProseWrapper from '$lib/components/ProseWrapper.svelte';
	import { mainEl } from '$lib/stores/main';
	import { createTextQuoteSelectorMatcher, describeTextQuote } from '$lib/annotator';
	import type { TextQuoteSelector } from '$lib/annotator/types';
	import { highlightText } from '$lib/annotator/highlighter';
	import { notifications } from '$lib/stores/notifications';
	import { TargetSchema, TextQuoteSelectorSchema } from '$lib/types/schemas/Annotations';
	import { page } from '$app/stores';
	export let articleID: number;
	export let articleUrl: string;
	export let annotations: Annotation[] = [];
	console.log({ annotations });

	export let highlights: Highlight[] = [];

	// TODO: add more elements beyond just images, such as videos, iframes, etc.
	let images: HTMLImageElement[] = [];
	$: console.log({ images });

	let centerOfWrapper: number;

	let wrapper: HTMLElement;
	let highlighter: Highlighter;
	let validSelection = false;
	let activeHighlightID = '';

	const highlight_uuids: string[] = [];

	let pending_highlight: HighlightBody | undefined;

	const annotationTooltip: ITooltip = {
		visible: false,
		top: 0
	};

	let highlightMenu = false;
	let highlightMenuTop = 0;
	let highlightMenuLeft = 0;

	let tooltipVisible = false;
	let tooltipTop = 0;
	let tooltipLeft = 0;

	const isValidSelection = (sel: Selection) =>
		sel && !sel.isCollapsed && sel.rangeCount > 0 && sel.containsNode(wrapper, true);

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
			nonTextNodes
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

	const createAnnotation = () => {
		// this is very finnicky, i don't understand why it can only properly read the html if it's called first thing, but it is what it is. I should look at it at some point, though, it's kind of a mess.
		const html = getSelectionHtml();
		const selection = window.getSelection();
		tooltipVisible = false;
		if (selection.isCollapsed) return;
		const range = selection.getRangeAt(0);
		const highlight = highlighter.fromRange(range);
		pending_highlight = createHighlightBody(highlight, html);
		activeHighlightID = highlight.id;
		annotationTooltip.visible = true;
		// selection.empty()
	};

	const isHighlight = (target: HTMLElement) =>
		target.dataset && target.dataset.id && highlight_uuids.includes(target.dataset.id);

	function handleClick(e: MouseEvent) {
		const target = e.target as HTMLElement;
		if (isHighlight(target)) {
			console.log('you clicked a highlight!');
			const { top, left, right, bottom, width } = target.getBoundingClientRect();
			if (top < 50) {
				highlightMenuTop = bottom + window.scrollY + 25;
			} else {
				highlightMenuTop = top + window.scrollY - 25;
			}
			highlightMenuLeft = left + width / 2 - 40;
			highlightMenu = true;
			activeHighlightID = target.dataset.uuid;
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
				selector: finder(el)
			}
		};
		console.log({ floatingAnnotation });
	};

	const updateHighlightElements = () => highlightElements.set(highlighter.getDoms());

	async function describeCurrentSelection() {
		const userSelection = window.getSelection()?.getRangeAt(0);
		if (!userSelection || userSelection.collapsed) return;
		return await describeTextQuote(userSelection);
	}
	async function highlightSelectorTarget(textQuoteSelector: TextQuoteSelector, id?: number) {
		const matches = createTextQuoteSelectorMatcher(textQuoteSelector)(document.body);

		// Modifying the DOM while searching can mess up; see issue #112.
		// Therefore, we first collect all matches before highlighting them.
		const matchList = [];
		for await (const match of matches) matchList.push(match);

		// const uuid = uuidv4();
		// return array of functions that will remove the highlight
		return matchList.map((match) =>
			highlightText(match, 'mark', {
				id: `annotation-${id?.toString()}` || ''
			})
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
			for (const annotation of annotations) {
				try {
					const target = TargetSchema.parse(annotation.target);
					highlightSelectorTarget(target.selector, annotation.id);
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
						block: 'center'
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
	<ProseWrapper bind:el={wrapper} on:click={handleClick}>
		<slot />
	</ProseWrapper>

	<annotations>
		<AnnotationsContainer
			on:cancel={() => {
				highlighter.remove(activeHighlightID);
				activeHighlightID = '';
			}}
			{annotations}
			{annotationTooltip}
			{articleID}
			{activeHighlightID}
			bind:pending_highlight
		/>
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
			on:annotate={createAnnotation}
			on:highlight={async () => {
				const userSelection = window.getSelection()?.getRangeAt(0);
				console.log({ userSelection });
				if (!userSelection || userSelection.collapsed) return;
				const selector = await describeTextQuote(userSelection);
				console.log({ selector });
				const removeHighlights = await highlightSelectorTarget(selector);
				window.getSelection()?.removeAllRanges();
				// todo: add pending state so that the highlight gets removed if it fails

				const res = await fetch('/annotations', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						// jfc let's fix this
						articleId: articleID,
						target: {
							source: articleUrl,
							selector
						}
					})
				});
				if (res.ok) {
					notifications.notify({
						type: 'success',
						message: 'Highlight created!'
					});
				} else {
					notifications.notify({
						type: 'error',
						message: 'Highlight failed!'
					});
					removeHighlights.forEach((removeHighlight) => removeHighlight());
				}
			}}
		/>
	</Tooltip>
{/if}
{#if highlightMenu}
	<Tooltip
		top={highlightMenuTop}
		left={highlightMenuLeft}
		visibility={highlightMenu ? 'visible' : 'hidden'}
		on:clickOutside={() => (highlightMenu = false)}
	>
		<!-- <button on:click={deleteHighlight}>Delete Highlight</button>
		<button on:click={createAnnotation}><AnnotateIcon /></button> -->
	</Tooltip>
{/if}

<style lang="postcss">
	:global(mark[id]) {
		cursor: pointer;
		@apply animate-saturate-pulse scroll-mt-24 rounded-sm border-b-2 border-yellow-400 bg-yellow-200 p-px dark:border-yellow-500 dark:bg-yellow-900/90 dark:text-amber-50;
		/* maybe broder should just be applied if there's an annotation attached */
	}
	:global(.dark mark[id]) {
		@apply bg-yellow-200/20 text-amber-200;
	}
</style>
