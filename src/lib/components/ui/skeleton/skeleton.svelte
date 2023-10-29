<script lang="ts">
	import { cn } from "$lib/utils";
	import type { HTMLAttributes } from "svelte/elements";

	type $$Props = HTMLAttributes<HTMLDivElement>;

	let className: $$Props["class"] = undefined;
	export { className as class };
</script>

<!-- bg-primary/10 -->
<div
	class={cn("animate-pulse rounded-md bg-muted", className)}
	{...$$restProps}
/>
