<script lang="ts">
	import { clickOutside } from '$lib/actions/clickOutside';
	import { createEventDispatcher } from 'svelte';

	import { scale, fade } from 'svelte/transition';
	export let top: number;
	export let left: number;
	export let visibility: 'hidden' | 'visible' = 'hidden';

	// alternatively, provide a DOMRect to attach to instead of top/left
	export let rect: DOMRect | null = null;
	let tooltip: HTMLDivElement;
	$: if (rect) {
		console.log({ rect, scroll: window.scrollY });
		if (tooltip) {
			top = rect.top + window.scrollY - tooltip.offsetHeight - 10;
		}
	}
	const dispatch = createEventDispatcher();
</script>

<div
	class="overflow-hidden rounded-lg bg-white shadow-md dark:bg-black/90"
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
