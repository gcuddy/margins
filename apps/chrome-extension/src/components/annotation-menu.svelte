<script lang="ts">
	import { onMount } from 'svelte';
	import { createFloatingActions } from 'svelte-floating-ui';
	import type {
		ClientRectObject,
		VirtualElement,
	} from 'svelte-floating-ui/core';
	import { writable } from 'svelte/store';
	import { offset, flip, shift } from 'svelte-floating-ui/dom';
	import AnnotationInlineMenu from './annotation-inline-menu.svelte';

	let show = false;

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

			show = true;
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
		strategy: 'absolute',
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

{#if show}
	<div id="floating-content" use:floatingContent>
		<div
			class="bg-popover text-popover-foreground z-50 w-fit rounded-lg border shadow-md outline-none"
		>
			<AnnotationInlineMenu />
		</div>
	</div>
{/if}
