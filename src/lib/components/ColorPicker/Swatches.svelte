<script lang="ts">
	import { colors } from '$lib/types/colors';
	import ColorSwatch from '../ColorSwatch.svelte';
</script>

<div class="flex px-2 py-4">
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
