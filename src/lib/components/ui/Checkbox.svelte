<script lang="ts">
	export let checked = false;
	import type { HTMLInputAttributes } from "svelte/elements";
	let className = "";
	export { className as class };
	interface $$Props extends HTMLInputAttributes {
		checked?: boolean;
		class?: string;
	}

	import { cn } from "$lib/utils/tailwind";
</script>

<input
	type="checkbox"
	bind:checked
	on:click
	on:change
	{...$$restProps}
	class={cn(
		"peer h-4 w-4 shrink-0 rounded-[4px] border border-input ring-offset-background checked:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
		className
	)}
/>

<style>
	input:checked {
		background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='20 6 9 17 4 12'%3e%3c/polyline%3e%3c/svg%3e");
	}
	:global(.dark) input:checked {
		background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='20 6 9 17 4 12'%3e%3c/polyline%3e%3c/svg%3e");
	}
</style>
