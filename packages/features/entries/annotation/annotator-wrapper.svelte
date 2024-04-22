<script lang="ts">
	import { onMount } from 'svelte';
	import { createFloatingActions } from 'svelte-floating-ui';
	import type {
		ClientRectObject,
		VirtualElement,
	} from 'svelte-floating-ui/core';
	import { writable } from 'svelte/store';
	import { offset, flip, shift } from 'svelte-floating-ui/dom';
	import {
		type TextQuoteSelector,
		describeTextQuote,
	} from '@margins/annotator';
	import { syncHighlights } from '@margins/annotator/dom';
	import type { Annotation } from '../../core/index.js';
	import AnnotationInlineMenu from './annotation-inline-menu.svelte';

	export let annotations: Annotation.Item[];
	export let onHighlight: (textQuote: TextQuoteSelector) => void;

	/**
	 * The root container for annotations. Selecting text outside of this container will not trigger the annotation menu.
	 * If set to "contain", the component will act as the root container for its children.
	 * If set to null, the document body will be the root container.
	 */
	export let rootEl: HTMLElement | 'contain' | null = null;

	let show = false;
	let dataAnnotationRootEl: HTMLElement;
	$: syncHighlights(
		// document.body,
		rootEl === 'contain' ? dataAnnotationRootEl : rootEl ?? document.body,
		annotations,
	);

	async function handleHighlight() {
		const range = window.getSelection()?.getRangeAt(0);
		if (!range) return;
		const textQuote = await describeTextQuote(range);
		onHighlight(textQuote);
	}

	function handleSelect() {
		const selection = window.getSelection();
		if (selection && selection.toString().length > 0) {
			const range = selection.getRangeAt(0);
			const rect = range.getBoundingClientRect();
			x = rect.x;
			y = rect.y;
			top = rect.top;
			left = rect.left;
			bottom = rect.bottom;
			right = rect.right;
			width = rect.width;
			height = rect.height;

			el = document.elementFromPoint(rect.x, rect.y);
			const parent = range.commonAncestorContainer.parentElement;
			if (rootEl) {
				if (parent) {
					if (
						rootEl === 'contain' &&
						parent.closest('[data-annotation-root]')
					) {
						show = true;
					} else {
						let curr: HTMLElement | null = parent;
						while (curr) {
							if (curr === rootEl) {
								show = true;
								break;
							}
							curr = curr.parentElement;
						}
					}
				}
			} else {
				show = true;
			}
		} else {
			show = false;
			x = 0;
			y = 0;
		}
	}

	const [floatingRef, floatingContent] = createFloatingActions({
		autoUpdate: false,
		middleware: [offset(6), flip(), shift()],
		placement: 'top',
		strategy: 'fixed',
	});

	let x = 0;
	let y = 0;
	let top = 0;
	let left = 0;
	let bottom = 0;
	let right = 0;
	let width = 0;
	let height = 0;
	let el: Element | null = null;

	$: getBoundingClientRect = (): ClientRectObject => {
		return {
			bottom,
			height,
			left,
			right,
			top,
			width,
			x,
			y,
		};
	};

	const virtualElement = writable<VirtualElement>({
		contextElement: el,
		getBoundingClientRect,
	});

	$: virtualElement.set({ contextElement: el, getBoundingClientRect });

	floatingRef(virtualElement);

	onMount(() => {
		document.addEventListener('selectionchange', handleSelect);

		return () => {
			document.removeEventListener('selectionchange', handleSelect);
		};
	});
</script>

<div data-annotation-root bind:this={dataAnnotationRootEl}>
	{#if show}
		<div id="floating-content" use:floatingContent>
			<div
				class="bg-popover text-popover-foreground z-50 w-fit rounded-lg border shadow-md outline-none"
			>
				<AnnotationInlineMenu onHighlight={handleHighlight} />
			</div>
		</div>
	{/if}
	<slot />
</div>

<style>
	:global(mark[data-margins-annotation-id]) {
		background-color: rgba(234, 179, 8, 0.25);
		color: inherit;
	}
</style>
