<script lang="ts">
	import { clickOutside } from '$lib/actions/clickOutside';
	import mq from '$lib/stores/mq';
	import { isTouchDevice } from '$lib/utils';
	import { createEventDispatcher } from 'svelte';

	import { scale, fade } from 'svelte/transition';
	export let top: number = 0;
	export let left: number = 0;
	export let visibility: 'hidden' | 'visible' = 'hidden';

	let mobile = isTouchDevice();
	// alternatively, provide a DOMRect to attach to instead of top/left
	export let rect: DOMRect | null = null;
	// if you do that you should also provide a container:
	export let container: HTMLElement | Window = window;
	let tooltip: HTMLDivElement;
	$: if (rect) {
		console.log({ rect });
		if (tooltip) {
			if (mobile || rect.y < tooltip.offsetHeight + 25) {
				console.log('mobile');
				top =
					rect.bottom +
					(container instanceof HTMLElement ? container.scrollTop : container.scrollY) +
					13;
			} else {
				top =
					rect.top +
					(container instanceof HTMLElement ? container.scrollTop : container.scrollY) -
					tooltip.offsetHeight -
					13;
			}
			if (container instanceof HTMLElement) {
				left = rect.left + rect.width / 2 - container.offsetLeft - tooltip.offsetWidth / 2;
			} else {
				left = rect.left;
			}
			console.log({ top, left });
		}
	}
	const dispatch = createEventDispatcher();

	$: console.log({ $mq });
</script>

<div
	class="absolute z-10 overflow-hidden rounded-lg bg-white shadow-md ring-1 ring-black/5 dark:border dark:border-gray-800 dark:bg-black/95 dark:ring-black/25"
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
		/* position: absolute;
		z-index: 9; */
		/* background-color: rgba(0, 0, 0, 0.5); */
		/* padding: 10px; */
	}
</style>
