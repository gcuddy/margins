<script lang="ts">
	import CommandItem from "$lib/components/ui/cmdk/Command.Item.svelte";
	import { cn } from "$lib/utils/tailwind";
	import type { HTMLBaseAttributes } from "svelte/elements";
	import type { ComponentProps } from "svelte";

	let className = "";
	export { className as class };
	interface $$Props extends HTMLBaseAttributes, ComponentProps<CommandItem> {
		class?: string;
	}
</script>

<CommandItem
	let:selected
	let:state
	let:handleSelect
	{...$$restProps}
	class={cn(
		"relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled]:pointer-events-none data-[active]:bg-accent data-[active]:text-accent-foreground data-[disabled]:opacity-50",
		className
	)}
>
	<slot {selected} {handleSelect} {state} />
</CommandItem>
