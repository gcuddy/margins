<script lang="ts">
	import type { HTMLInputAttributes } from "svelte/elements";

	import { cn } from "$lib/utils/tailwind";

	export let value: string | number | undefined = undefined;
	export let ref: HTMLInputElement | undefined = undefined;
	let className = "";
	export { className as class };
	interface $$Props extends HTMLInputAttributes {
		ref?: HTMLInputElement;
		value?: string | number | undefined;
		class?: string;
	}
</script>

<input
	bind:value
	class={cn(
		"flex h-10 w-full rounded-md border border-gray-300 bg-transparent py-2 px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-50 dark:focus:ring-gray-400 dark:focus:ring-offset-gray-900",
		className
	)}
	on:focus
	on:blur
	on:change
	on:keydown
	on:input
	bind:this={ref}
	{...$$restProps}
/>
