<script lang="ts">
	import { cn } from "$lib/utils/tailwind";
	import type { HTMLAttributes } from "svelte/elements";
	let className: string | undefined | null = "";
	export { className as class };
	interface $$Props extends HTMLAttributes<HTMLDivElement> {}
</script>

<div
	class={cn("h-5 w-2/5 animate-pulse rounded-lg bg-gray-100", className)}
	{...$$restProps}
/>
