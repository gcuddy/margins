<script lang="ts">
	import { cn } from "$lib/utils/tailwind";
	import type {
		HTMLInputAttributes,
		HTMLSelectAttributes,
	} from "svelte/elements";

	export let value: number | undefined = undefined;
	let className = "";
	export { className as class };
	interface $$Props extends HTMLInputAttributes {
		class?: string;
	}
</script>

<input
	type="range"
	{...$$restProps}
	bind:value
	class={cn(
		"relative flex h-2 w-full touch-none select-none appearance-none items-center rounded-full bg-secondary",
		className
	)}
/>

<style lang="postcss">
	input::-webkit-slider-thumb {
		@apply block appearance-none rounded-full border-2 border-primary bg-foreground  ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50;
		height: var(--thumb, 1.25rem);
		width: var(--thumb, 1.25rem);
	}
</style>
