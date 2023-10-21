<script lang="ts">
	import CommandEmpty from "$lib/components/ui/cmdk/Command.Empty.svelte";
	import { cn } from "$lib/utils/tailwind";
	import type { ComponentProps } from "svelte";
	import type { HTMLBaseAttributes } from "svelte/elements";

	let className = "";
	export { className as class };
	interface $$Props extends HTMLBaseAttributes, ComponentProps<CommandEmpty> {
		class?: string;
	}
</script>

<CommandEmpty
	{...$$restProps}
	class={cn("py-6 text-center text-sm", className)}
>
	<slot />
</CommandEmpty>
