<script lang="ts">
	import type { Action } from '$lib/actions/types';
	import type { VirtualElement } from '@popperjs/core';
	import type { IconName } from '$lib/icons';
	import type { ComponentProperties } from '$lib/stores/types';
	import { fadeScale } from '$lib/transitions';

	import { Menu, MenuButton, MenuItems, MenuItem } from '@rgossiaux/svelte-headlessui';
	import { createPopperActions } from 'svelte-popperjs';
	import { fade, fly, scale } from 'svelte/transition';
	import Icon from './helpers/Icon.svelte';
	import { onMount } from 'svelte';
	import Overlay from './Overlay.svelte';

	interface MenuItem {
		label: string;
		icon: IconName;
		iconProps?: ComponentProperties<Icon>;
		perform?: () => void;
		href?: string;
		enabled?: boolean;
		kbd?: string[];
		items?: MenuItem[];
	}

	export let items: MenuItem[][];

	export let icons: 'solid' | 'outline' = 'solid';
	let openProp: boolean;
	export { openProp as open };
	export let x: number;
	export let y: number;

	function generateGetBoundingClientRect(x = 0, y = 0) {
		return () =>
			({
				width: 0,
				height: 0,
				top: y,
				right: x,
				bottom: y,
				left: x,
			} as DOMRect);
	}
	const virtualElement = {
		getBoundingClientRect: generateGetBoundingClientRect(),
	};

	const [popperRef, popperContent, getInstance] = createPopperActions({
		placement: 'right-start',
		strategy: 'fixed',
	});

	async function refresh() {
		console.log('refreshing');
		const newState = await getInstance()?.update();
		console.log({ newState });
	}

	$: virtualElement.getBoundingClientRect = generateGetBoundingClientRect(x, y);
	$: x, refresh();
	$: console.log({ x, y, virtualElement });
	popperRef(virtualElement);

	// GET READY: this is an extremely hacky way to do this and I don't like it!

	let clickButton: () => void;

	function createHiddenButton(node: HTMLElement): ReturnType<Action> {
		node.setAttribute('type', 'button');
		node.setAttribute('aria-hidden', 'true');
		node.setAttribute('tabindex', '-1');
		node.style.position = 'fixed';
		node.style.width = '1px';
		node.style.height = '1px';
		node.style.overflow = 'hidden';
		node.style.pointerEvents = 'none';
		node.style.zIndex = '-1';
		node.style.top = `-${x}px`;
		node.style.left = `-${y}px`;
		clickButton = () => node.click();
		return {
			update: () => {
				node.style.top = `-${x}px`;
				node.style.left = `-${y}px`;
			},
		};
	}
	$: openProp, openProp ? clickButton() : null;
</script>

<Menu let:open>
	<MenuButton
		use={[createHiddenButton]}
		class="group flex items-center rounded-md p-1.5 hover:bg-gray-200 focus:bg-gray-200 {open &&
			'bg-gray-200'}"><slot /></MenuButton
	>
	{#if open}
		<!-- omg -->
		<Overlay on:destroy={() => (openProp = false)} />
	{/if}
	{#if open}
		<div class="relative z-20" use:popperContent>
			<div>
				<MenuItems
					static
					class="z-20 mt-2 flex w-56 origin-top-right scale-100 transform flex-col divide-y divide-gray-100 rounded-md bg-white py-1 opacity-100 shadow-lg ring-1 ring-black/5 focus:outline-none"
				>
					<!-- can either slot in items yourself, or let component do it for you -->
					<slot name="items" />
					{#each items as group}
						<div class="py-1 px-1">
							{#each group as { href, label, icon, iconProps, perform }}
								<MenuItem let:active>
									<div
										class="flex h-8 cursor-default select-none items-center space-x-4 rounded px-3.5 text-sm text-gray-900 {active
											? 'bg-gray-100'
											: ''}"
										on:click={perform}
									>
										{#if iconProps}
											<Icon name={icon} {...iconProps} />
										{:else}
											<Icon
												className={icons === 'solid'
													? 'h-4 w-4 fill-current'
													: 'h-4 w-4 stroke-2 stroke-current'}
												name={icon}
											/>
										{/if}
										{#if href}
											<a data-sveltekit-prefetch {href}>{label}</a>
										{:else}
											<span class="cursor-default">
												{label}
											</span>
											<!-- button -->
										{/if}
									</div>
								</MenuItem>
							{/each}
						</div>
					{/each}
				</MenuItems>
			</div>
		</div>
	{/if}
</Menu>
