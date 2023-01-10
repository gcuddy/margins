<script lang="ts">
	import { colors } from '$lib/types/colors';
	import ColorSwatch from '../ColorSwatch.svelte';
	let cls = 'px-2 py-4';
	export { cls as class };
</script>

<div class="flex {cls}">
	{#each Object.entries(colors) as [color, hex]}
		<ColorSwatch
			on:click={(e) => {
				e.preventDefault();
			}}
			{color}
			{hex}
		/>
	{/each}
</div>
