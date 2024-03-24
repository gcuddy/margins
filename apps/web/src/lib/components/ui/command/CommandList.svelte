<script lang="ts">
	import CommandList from "$lib/components/ui/cmdk/Command.List.svelte";
	import { cn } from "$lib/utils/tailwind";
	import type { HTMLBaseAttributes } from "svelte/elements";

	let className = "";
	export { className as class };
	interface $$Props extends HTMLBaseAttributes {
		class?: string;
	}
</script>

<CommandList
	class={cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className)}
>
	<slot />
</CommandList>
