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
	{...$$restProps}
	class={cn(
		"relative flex cursor-default select-none items-center rounded-md px-2 py-1.5 text-sm font-medium outline-none aria-selected:bg-gray-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:aria-selected:bg-gray-700",
		className
	)}
>
	<slot />
</CommandItem>
