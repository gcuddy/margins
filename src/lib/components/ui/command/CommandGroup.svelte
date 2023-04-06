<script lang="ts">
	import CommandGroup from "$lib/components/ui/cmdk/Command.Group.svelte";
	import { cn } from "$lib/utils/tailwind";
	import type { ComponentProps } from "svelte";
	import type { HTMLBaseAttributes } from "svelte/elements";

	let className = "";
	export { className as class };
	interface $$Props extends HTMLBaseAttributes, ComponentProps<CommandGroup> {
		class?: string;
	}
</script>

<CommandGroup
	{...$$restProps}
	class={cn(
		"overflow-hidden px-2 py-3 text-slate-700 dark:text-slate-400 [&_[data-cmdk-group-heading]]:px-2 [&_[data-cmdk-group-heading]]:pb-1.5 [&_[data-cmdk-group-heading]]:text-sm [&_[data-cmdk-group-heading]]:font-semibold [&_[data-cmdk-group-heading]]:text-slate-900 [&_[data-cmdk-group-heading]]:dark:text-slate-300",
		className
	)}
>
	<slot />
</CommandGroup>
