<script lang="ts">
	import { clickOutside } from '$lib/actions/clickOutside';
	import { createEventDispatcher } from 'svelte';

	import { scale, fade } from 'svelte/transition';
	export let top: number = 0;
	export let left: number = 0;
	export let visibility: 'hidden' | 'visible' = 'hidden';

	// alternatively, provide a DOMRect to attach to instead of top/left
	export let rect: DOMRect | null = null;
	// if you do that you should also provide a container:
	export let container: HTMLElement | Window = window;
	let tooltip: HTMLDivElement;
	$: if (rect) {
		console.log({ rect });
		if (tooltip) {
			top =
				rect.top +
				(container instanceof HTMLElement ? container.scrollTop : container.scrollY) -
				tooltip.offsetHeight -
				13;
			if (container instanceof HTMLElement) {
				left = rect.left + rect.width / 2 - container.offsetLeft - tooltip.offsetWidth / 2;
			} else {
				left = rect.left;
			}
			console.log({ top, left });
		}
	}
	const dispatch = createEventDispatcher();
</script>

<div
	class="overflow-hidden rounded-lg bg-white shadow-md ring-1 ring-black/5 dark:bg-black/90"
	style="top: {top}px; left: {left}px; visibility: {visibility};"
	bind:this={tooltip}
	in:scale={{
		start: 0.7,
		duration: 150
	}}
	out:fade={{
		duration: 150
	}}
	use:clickOutside={() => dispatch('clickOutside')}
>
	<slot />
</div>

<style>
	div {
		position: absolute;
		z-index: 9;
		/* background-color: rgba(0, 0, 0, 0.5); */
		/* padding: 10px; */
	}
</style>
