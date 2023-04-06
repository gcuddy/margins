<script lang="ts">
	import Command from "$lib/components/ui/cmdk/Command.Root.svelte";
	import { cn } from "$lib/utils/tailwind";
	import type { HTMLBaseAttributes } from "svelte/elements";
	let className = "";
	export { className as class };
	interface $$Props extends HTMLBaseAttributes {
		class?: string;
	}
</script>

<Command
	{...$$restProps}
	class={cn(
		"flex h-full w-full flex-col overflow-hidden rounded-lg bg-white dark:bg-slate-800",
		className
	)}
>
	<slot />
</Command>
