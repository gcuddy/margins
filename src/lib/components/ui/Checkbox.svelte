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
	{...$$restProps}
	class={cn(
		"peer h-4 w-4 shrink-0 cursor-pointer rounded-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-50 dark:focus:ring-gray-400 dark:focus:ring-offset-gray-900",
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
