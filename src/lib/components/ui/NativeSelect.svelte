<script lang="ts">
	import { cn } from "$lib/utils/tailwind";
	import type { HTMLSelectAttributes } from "svelte/elements";

	export let value: any | undefined = undefined;
	let className = "";
	export { className as class };
	interface $$Props extends HTMLSelectAttributes {
		class?: string;
	}
</script>

<select
	class={cn(
		"flex h-10 w-full appearance-none items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
		className
	)}
	on:change
	bind:value
	{...$$restProps}
>
	<slot />
</select>

<style>
	select {
		background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
		background-position: right 0.5rem center;
		background-repeat: no-repeat;
		background-size: 1.5em 1.5em;
		padding-right: 2.5rem;
		-webkit-print-color-adjust: exact;
		print-color-adjust: exact;
	}
</style>
