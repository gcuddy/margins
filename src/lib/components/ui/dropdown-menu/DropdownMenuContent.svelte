<script lang="ts">
	import { useDropDownMenuContext } from "$lib/components/ui/dropdown-menu/DropdownMenu.svelte";
	import { cn } from "$lib/utils/tailwind";
	import { MenuItems, Portal, Transition } from "@rgossiaux/svelte-headlessui";
	import { getContext } from "svelte";
	import type { HTMLBaseAttributes } from "svelte/elements";
	import type { Readable } from "svelte/store";
	import { fade, fly, slide } from "svelte/transition";

	const state = useDropDownMenuContext("DropdownMenuContent");
	const headlessui_state: Readable<{
		menuState: import("@rgossiaux/svelte-headlessui/components/menu/Menu.svelte").MenuStates;
	}> = getContext("headlessui-menu-context");

	$: open = $headlessui_state.menuState === 0;

	let c = "";
	export { c as class };
	export let offset: number = 4;

	interface $$Props extends HTMLBaseAttributes {
		offset?: number;
		class?: string;
	}

	$: ({ popperContent } = $state);

	$: console.log({ popperContent, type: typeof popperContent });
	$: popperOpts = {
		strategy: "fixed",
		modifiers: [
			{
				name: "offset",
				options: {
					offset: [0, offset],
				},
			},
			{
				name: "preventOverflow",
				options: {
					padding: 16,
				},
			},
			// {
			// 	name: "flip",
			// 	options: {
			// 		fallbackPlacements: ["top", "bottom"],
			// 	},
			// },
		],
	};
	$: propsWeControl = {
		"data-state": open ? "open" : "closed",
	};
</script>

<!-- Portal? -->

<!-- svelte-ignore -->
<!-- <Transition
	enter="transition ease-out duration-100"
	enterFrom="transform opacity-0 scale-95"
	enterTo="transform opacity-100 scale-100"
	leave="transition ease-in duration-75"
	leaveFrom="transform opacity-100 scale-100"
	leaveTo="transform opacity-0 scale-95"
    > -->
<Portal>
	{#if open}
		<div
			use:popperContent={popperOpts}
			out:fade|local={{
				duration: 200,
			}}
		>
			<MenuItems
				static
				class={cn(
					"z-50 min-w-[8rem] overflow-hidden rounded-md border border-gray-100 bg-white p-1 text-gray-700 shadow-md outline-none dark:border-gray-800 dark:bg-gray-800 dark:text-gray-400",
					c
				)}
			>
				<slot />
				<!-- TODO -->
			</MenuItems>
		</div>
	{/if}
	<!-- </Transition> -->
</Portal>
