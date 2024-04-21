<script lang="ts">
	import { writable } from 'svelte/store';
	import Highlighter from 'lucide-svelte/icons/highlighter';
	import EditIcon from 'lucide-svelte/icons/square-pen';

	export let onHighlight = () => {};
	export let onAnnotate = () => {};

	const mouseDown = writable(false);

	const openDelay = 20;
	const closeDelay = 20;
</script>

<!-- <svelte:window on:keydown={handleKeydown} /> -->

<svelte:document
	on:mousedown={(e) => {
		if (
			e.target instanceof HTMLElement &&
			e.target.closest('[data-annotation-popover]')
		) {
			return;
		}
		mouseDown.set(true);
	}}
	on:mouseup={() => {
		mouseDown.set(false);
	}}
/>

<!-- TODO: replace buttons + text with icons + tooltips, and replace highlight button with a color (indicating current highlight color) -->
<div class="flex">
	<button
		on:click={onHighlight}
		class="hover:bg-secondary hover:text-secondary-foreground flex flex-col items-center gap-1 p-3"
	>
		<Highlighter class="mr-1.5 h-4 w-4 stroke-[1.5]" />
		<span class="text-muted-foreground text-xs">highlight</span></button
	>
	<button
		on:click={onAnnotate}
		class="hover:bg-secondary hover:text-secondary-foreground flex flex-col items-center gap-1 p-3"
	>
		<EditIcon class="mr-1.5 h-4 w-4 stroke-[1.5]" />
		<span class="text-muted-foreground text-xs">annotate</span></button
	>
</div>
