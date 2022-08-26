<script lang="ts">
	// https://www.w3.org/WAI/ARIA/apg/patterns/menu/

	// TODO: calculate left/right/top/bottom automatically, unless otherwice specified

	import { onMount, SvelteComponent, tick } from 'svelte';
	import { clickOutside } from '$lib/actions/clickOutside';
	import { fade } from 'svelte/transition';
	import { MenuID } from './Menu';
	import { writable, type Writable } from 'svelte/store';
	import type { IconName } from '$lib/icons';
	import MenuItems from './MenuItems.svelte';
	import MenuItem from './MenuItem.svelte';
	import Icon from '../helpers/Icon.svelte';
	import { Keys } from '$lib/types/keyboard';
	import type { ComponentProperties } from '$lib/stores/types';
	export let expanded = false;
	export let align: 'left' | 'right' = 'left';
	export let position: 'top' | 'bottom' = 'bottom';
	export let menuItems: MenuItem[][] = [];

	// this maybe should just be a new component
	export let buttonAriaLabel: string | undefined = undefined;

	const id = $MenuID++;
	let menu: HTMLDivElement;
	let menuButton: HTMLButtonElement;

	interface MenuState {
		activeIndex: number | null;
	}
	const menuState: Writable<MenuState> = writable();

	interface MenuItem {
		display: string;
		icon: IconName;
		iconProps?: ComponentProperties<Icon>;
		perform: () => void;
		enabled?: boolean;
		id: number;
		kbd?: string[];
		items?: MenuItem[];
	}

	// abstract out to util function, and make it so that MenuItem.id is now not optional
	let menuItemIndex = -1;
	for (const group of menuItems) {
		for (const item of group) {
			if (!item.id) {
				item.id = ++menuItemIndex;
			}
		}
	}
	console.log({ menuItems });

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'ArrowDown') {
			// e.preventDefault();
			// open();
		}
	}
	function handleMenuKeydown(e: KeyboardEvent) {
		if (e.key === 'Tab') {
			// Focus Trap
			e.preventDefault();
			e.stopPropagation();
		}
		if (e.key === Keys.ArrowDown) {
			// focus on next item
			e.preventDefault();
			e.stopPropagation();
			console.log({
				focus: $focus,
				menuItemIndex
			});
			$focus = Math.min($focus + 1, menuItemIndex);
		}
		if (e.key === Keys.ArrowUp) {
			// focus on next item
			e.preventDefault();
			e.stopPropagation();
			$focus = Math.max($focus - 1, 0);
		}
	}
	function open() {
		expanded = true;
		tick().then(() => {
			if (menu) {
				const checked = menu.querySelector<HTMLButtonElement>(
					'button[role*="menuitem"][aria-checked="true"]'
				);
				if (checked) {
					checked.focus();
				} else {
					menu.querySelector<HTMLButtonElement>('button:not([disabled])')?.focus();
				}
			}
		});
	}
	function close(e?: KeyboardEvent) {
		expanded = false;
		menuButton.focus();
	}
	$: console.log({ expanded });

	const focus = writable(-1);

	$: menu &&
	menuButton &&
	window.innerHeight -
		menuButton.getBoundingClientRect().bottom -
		menu.getBoundingClientRect().height <
		50
		? (position = 'top')
		: (position = 'bottom');
	$: menu &&
	menuButton &&
	window.innerWidth -
		menuButton.getBoundingClientRect().right -
		menu.getBoundingClientRect().width <
		5
		? (align = 'right')
		: (align = 'left');
</script>

<svelte:window
	on:keydown={(e) => {
		if (e.key === 'Escape') close();
	}}
/>

<div
	class="relative inline-block"
	use:clickOutside={() => {
		if (expanded) close();
	}}
>
	<div class="flex items-center">
		<button
			class="cursor-pointer rounded-lg p-0.5 hover:bg-gray-100 active:bg-gray-100 dark:hover:bg-gray-800 {expanded
				? 'bg-gray-100'
				: ''}"
			bind:this={menuButton}
			on:keydown={handleKeydown}
			on:click={() => {
				if (expanded) close();
				else open();
			}}
			aria-haspopup="true"
			aria-expanded={expanded ? 'true' : undefined}
			aria-controls="menu-{id}"
			aria-label={buttonAriaLabel}
			type="button"><slot>More</slot></button
		>
	</div>
	{#if expanded}
		<div
			class="absolute {align === 'right' ? 'right-0' : 'left-0'}
        {position === 'top' ? 'bottom-full' : ''}
        z-50 w-56 origin-top-right overflow-hidden rounded-lg border  bg-gray-100/90 text-gray-800 shadow-lg  backdrop-blur-lg focus:outline-none  dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:shadow-2xl dark:shadow-gray-900 dark:backdrop-blur-xl"
			role="menu"
			id="menu-{id}"
			tabindex="0"
			on:keydown={handleMenuKeydown}
			out:fade={{ duration: 200 }}
			bind:this={menu}
			on:click={(e) => {
				close();
			}}
		>
			<!-- Expect Menu Item or Menu Items -->
			<!-- <slot {menuState} /> -->
			<slot name="menu-items" />
			<div class="divide-y-2 divide-gray-600 px-1">
				{#each menuItems as menuItemGroup}
					<MenuItems {focus}>
						{#each menuItemGroup as menuItem, index}
							<MenuItem on:click={menuItem.perform} {focus} id={menuItem.id}>
								<svelte:fragment slot="icon">
									{#if menuItem.icon}
										{#if typeof menuItem.icon === 'string'}
											<Icon
												name={menuItem.icon}
												className="h-4 w-4 stroke-2 stroke-gray-700 text-gray-700"
											/>
										{:else}
											<svelte:component this={menuItem.icon} />
										{/if}
									{/if}
								</svelte:fragment>
								<span class="font-normal">{menuItem.display}</span>
							</MenuItem>
						{/each}
					</MenuItems>
				{/each}
			</div>
		</div>
	{/if}
</div>
