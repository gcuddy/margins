<script lang="ts">
	import { cn } from "$lib/utils/tailwind";
	import type { HTMLTextareaAttributes } from "svelte/elements";
	let className = "";
	export let value = "";
	export { className as class };
	interface $$Props extends HTMLTextareaAttributes {
		class?: string;
		value?: string;
		el?: HTMLTextAreaElement;
	}
	export let el: HTMLTextAreaElement | undefined = undefined;

	$: console.log({ value });
</script>

<textarea
	bind:value
	bind:this={el}
	class={cn(
		"flex h-20 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
		className
	)}
	{...$$restProps}
/>
