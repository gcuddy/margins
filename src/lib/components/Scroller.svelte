<script lang="ts">
	import { createEventDispatcher, onMount, tick } from 'svelte';
	type T = $$Generic;

	export let items: T[];

	type Key = T extends {} ? keyof T : undefined;
	export let key: Key = undefined as Key;

	export function capture() {
		const scroll = scroller.scrollTop;
		return { a, b, top, bottom, heights, scroll };
	}

	export async function restore(state: {
		a: number;
		b: number;
		top: number;
		bottom: number;
		heights: number[];
		scroll: number;
	}) {
		a = state.a;
		b = state.b;
		top = state.top;
		bottom = state.bottom;
		heights = state.heights;

		await tick();
		scroller.scrollTo(0, state.scroll);
	}

	const dispatch = createEventDispatcher();

	let viewport: HTMLDivElement;
	let scroller: HTMLDivElement;
	let content: HTMLDivElement;

	export let a = 0;
	export let b = items.length;
    export let estimatedHeight = 100;
	let offset = 0;
	let top = 0;
	let bottom = 0;
	let heights: number[] = [];

	$: console.log({ items });

	$: average = heights.reduce((a, b) => a + b, 0) / heights.length;
    $: console.log({a, b, offset, top, bottom, heights, average})

	export function scrollTo(index: number, opts?: {
        height?: number;
    }) {
        console.log('scrollTo', index)
		tick().then(() => {
			// check if the item is already visible
			const el = content.querySelector(`[data-item-id="${index}"]`);
			if (
				el &&
				el.getBoundingClientRect().top >= 0 &&
				el.getBoundingClientRect().bottom <= scroller.getBoundingClientRect().bottom
			)
				return;
			const height = opts?.height ?? heights[index] ?? average;
            console.log('scrolling to', {index, height, offset, a, b, total: index * height})
			scroller.scrollTo(0, (height * index) - offset);
		});
	}

	function measure(node: HTMLDivElement, id: number) {
		console.log('measuring', id);
		const height = node.clientHeight;
		const current_height = heights[id];

		if (current_height !== height) {
			if (current_height !== undefined) {
				// adjust scroll to account for resized image
				if (node.getBoundingClientRect().top < scroller.getBoundingClientRect().top) {
					scroller.scrollTop += height - current_height;
				}
			}

			heights[id] = height;
		}
	}

	function handle_resize() {
		offset = content.offsetTop;
		handle_scroll();
	}

	function handle_scroll() {
		let i = 0;
		let acc = 0;

		for (; i < items.length; i += 1) {
			const height = heights[i] ?? average;

			if (acc + height > scroller.scrollTop - offset) {
				a = i;
				top = acc;
				break;
			}
			acc += height;
		}

		for (; i <= items.length; i += 1) {
			if (acc >= scroller.scrollTop + viewport.clientHeight - offset + 200) {
				b = i;
				break;
			}
			acc += heights[i] ?? average;
		}

		bottom = 0;
		for (; i < items.length; i += 1) {
			bottom += heights[i] ?? average;
		}

		const remaining = scroller.scrollHeight - (scroller.scrollTop + viewport.clientHeight);
		if (remaining < 500) {
			dispatch('more');
		}
	}

	onMount(handle_resize);
</script>

<svelte:window on:resize={handle_resize} />

<div bind:this={viewport} class="w-full h-full overflow-hidden">
	<div
		bind:this={scroller}
		class="w-full h-full overflow-y-scroll"
		style="overflow-anchor: none"
		on:scroll={handle_scroll}
	>
		<slot name="header" />

		<div bind:this={content} style:padding-top="{top}px" style:padding-bottom="{bottom}px">
			{#each items.slice(a, b) as item, i (key ? item[key] : item)}
				<div class="flow-root" data-item-id={a + i} use:measure={a + i}>
					<slot name="item" {item} i={a + i} />
				</div>
			{:else}
				<slot name="empty" />
			{/each}
		</div>

		<slot name="footer" />
	</div>
</div>
