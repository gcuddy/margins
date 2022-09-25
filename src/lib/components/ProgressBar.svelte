<script>
	import { navigating } from '$app/stores';
	import { onDestroy } from 'svelte';
	import { tweened } from 'svelte/motion';
	let loading = false;
	let timeout;
	const DELAY = 500;
	let width = tweened(0);
	const unsubscribe = navigating.subscribe((value) => {
		if (value) {
			loading = true;
			width.set(0.25);
			// if loading takes longer than 500ms, show the progress bar
			timeout = setTimeout(() => {
				if (!value) return;
				width.set(0.25);
			}, DELAY);
		} else {
			width.set(100);
			loading = false;
			width.set(0);
			clearTimeout(timeout);
			// width.set(0);
		}
	});
	onDestroy(unsubscribe);
</script>

<!-- {$width} -->
<!-- {loading}
{$width} -->
{#if loading}
	<div style="width:{$width}%;" class="fixed top-0 z-10 h-1 bg-green-300" />
{/if}
