<script lang="ts">
	import { colors as default_colors } from "$lib/types/colors";
	import { createEventDispatcher } from "svelte";
	import ColorSwatch from "../ColorSwatch.svelte";
	let cls = "px-2 py-4";
	export { cls as class };
	const dispatch = createEventDispatcher<{
		select: string;
	}>();

	interface Color {
		name: string;
		hex: string;
		check?: "light" | "dark";
	}
	export let colors: Color[] = Object.entries(default_colors).map(([name, hex]) => ({ name, hex }));

	// HEX STRING
	export let selected: string | undefined = undefined;
</script>

<!-- TODO: should tab into div, then use arrow keys to navigate -->
<div class="flex items-center justify-around {cls}">
	{#each colors as { name, hex }}
		<ColorSwatch
			on:click={(e) => {
				e.preventDefault();
				dispatch("select", hex);
				selected = hex;
			}}
			{hex}
			selected={selected === hex}
		/>
	{/each}
</div>
