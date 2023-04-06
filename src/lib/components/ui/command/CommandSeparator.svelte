<script lang="ts">
	import CommandSeparator from "$lib/components/ui/cmdk/Command.Separator.svelte";
	import { cn } from "$lib/utils/tailwind";
	import type { HTMLBaseAttributes } from "svelte/elements";
	import type { ComponentProps } from "svelte";

	let className = "";
	export { className as class };
	interface $$Props
		extends HTMLBaseAttributes,
			ComponentProps<CommandSeparator> {
		class?: string;
	}
</script>

<CommandSeparator
	{...$$restProps}
	class={cn("-mx-1 h-px bg-gray-100 dark:bg-gray-700", className)}
>
	<slot />
</CommandSeparator>
