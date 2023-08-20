<script lang="ts">
	import { Tooltip as TooltipPrimitive } from "bits-ui";
	import { cn } from "$lib/utils";
	import { fly } from "svelte/transition";

	type $$Props = TooltipPrimitive.ContentProps;

	let className: $$Props["class"] = undefined;
	export let sideOffset: $$Props["sideOffset"] = 4;
	export { className as class };
</script>

<TooltipPrimitive.Content
	{sideOffset}
    transition={fly}
    transitionConfig={{
        y: 20
    }}
	class={cn(
		"z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md",
		className
	)}
	{...$$restProps}
>
	<slot />
</TooltipPrimitive.Content>
