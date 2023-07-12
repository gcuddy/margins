<script lang="ts">
	import { useDropDownMenuContext } from '$lib/components/ui/dropdown-menu/DropdownMenu.svelte';
	import { fadeScale } from '$lib/transitions';
	import { cn } from '$lib/utils/tailwind';
	import type { Placement } from '@popperjs/core';
	import { MenuItems, Portal, Transition } from '@rgossiaux/svelte-headlessui';
	import { getContext } from 'svelte';
	import type { HTMLBaseAttributes } from 'svelte/elements';
	import type { Readable } from 'svelte/store';
	import { fade, fly, slide } from 'svelte/transition';

	const state = useDropDownMenuContext('DropdownMenuContent');
	const headlessui_state: Readable<{
		menuState: import('@rgossiaux/svelte-headlessui/components/menu/Menu.svelte').MenuStates;
	}> = getContext('headlessui-menu-context');

	$: open = $headlessui_state.menuState === 0;

	let c = '';
	export { c as class };
	export let offset = 4;
	export let xoffset = 0;
	export let placement: Placement = 'auto';

	interface $$Props extends HTMLBaseAttributes {
		offset?: number;
		class?: string;
		placement?: Placement;
		xoffset?: number;
	}

	const { popperContent } = $state;
	// let ({ popperContent } = $state);

	$: propsWeControl = {
		'data-state': open ? 'open' : 'closed'
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
			use:popperContent={{
				strategy: 'fixed',
				placement,
				modifiers: [
					{
						name: 'offset',
						options: {
							offset: [xoffset, offset]
						}
					},
					{
						name: 'preventOverflow',
						options: {
							padding: 16
						}
					}
				]
			}}
			out:fade={{
				duration: 200
			}}
			class="z-50"
		>
			<MenuItems
				static
				class={cn(
					'z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md',
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
