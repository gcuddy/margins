<script lang="ts">
	import { cn } from "$lib/utils/tailwind";
	import type { HTMLTextareaAttributes } from "svelte/elements";
	let className = "";
	export let value = "";
	export { className as class };
	interface $$Props extends HTMLTextareaAttributes {
		class?: string;
		value?: string;
	}
</script>

<textarea
	bind:value
	class={cn(
		"flex h-20 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-50 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900",
		className
	)}
	{...$$restProps}
/>
