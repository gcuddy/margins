<script>
	import { clickOutside } from '$lib/actions/clickOutside';
	import { createEventDispatcher } from 'svelte';
	import { backInOut, backOut } from 'svelte/easing';
	const dispatch = createEventDispatcher();

	import { fade, scale } from 'svelte/transition';
</script>

<div
	class="z-10 select-none overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black/5 dark:border dark:border-gray-800 dark:bg-black/95 dark:ring-black/25"
	in:scale={{
		start: 0.7,
		duration: 300,
		easing: backInOut,
	}}
	out:fade={{
		duration: 150,
	}}
	use:clickOutside={() => dispatch('clickOutside')}
>
	<slot />
</div>
