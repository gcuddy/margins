<script lang="ts">
	import { cn } from "$lib/utils/tailwind";
	import type { HTMLAttributes } from "svelte/elements";
	let className: string | undefined | null = "";
	export { className as class };
	interface $$Props extends HTMLAttributes<HTMLDivElement> {}
</script>

<div
	class={cn("animate-pulse rounded-md bg-muted", className)}
	{...$$restProps}
/>
