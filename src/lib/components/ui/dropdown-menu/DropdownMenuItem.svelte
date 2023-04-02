<script lang="ts">
	import { cn } from "$lib/utils/tailwind";
	import { MenuItem } from "@rgossiaux/svelte-headlessui";
	import type { HTMLBaseAttributes } from "svelte/elements";
	let className = "";
	export { className as class };
	export let inset = false;

	interface $$Props extends HTMLBaseAttributes {
		inset?: boolean;
		class?: string;
	}
</script>

<MenuItem let:active as="div">
	<div
		class={cn(
			"relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm font-medium outline-none focus:bg-gray-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:focus:bg-gray-700",
			inset && "pl-8",
			active && "bg-gray-100 dark:bg-gray-700",
			className
		)}
	>
		<slot />
	</div></MenuItem
>
