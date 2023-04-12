<script lang="ts">
	import Command from "$lib/components/ui/cmdk/Command.Root.svelte";
	import { cn } from "$lib/utils/tailwind";
	import type { HTMLBaseAttributes } from "svelte/elements";
	import type { ComponentProps } from "svelte";
	let className = "";
	export { className as class };
	interface $$Props extends HTMLBaseAttributes, ComponentProps<Command> {
		class?: string;
	}
</script>

<Command
	let:selected
	on:close
	on:add
	on:remove
	{...$$restProps}
	class={cn(
		"flex h-full w-full flex-col overflow-hidden rounded-lg bg-white dark:bg-gray-800",
		className
	)}
>
	<slot {selected} />
</Command>
