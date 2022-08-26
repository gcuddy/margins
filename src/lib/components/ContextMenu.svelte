<script lang="ts">
	import type { Action } from '$lib/actions/types';

	import type { IconName } from '$lib/icons';
	import type { ComponentProperties } from '$lib/stores/types';
	import { fadeScale } from '$lib/transitions';

	import { Menu, MenuButton, MenuItems, MenuItem, Transition } from '@rgossiaux/svelte-headlessui';
	import { createPopperActions } from 'svelte-popperjs';
	import { portal } from 'svelte-portal';
	import { fade, fly, scale } from 'svelte/transition';
	import Icon from './helpers/Icon.svelte';

	export let placement:
		| 'bottom-start'
		| 'bottom-end'
		| 'top-start'
		| 'top-end'
		| 'right-start'
		| 'right-end'
		| 'left-start'
		| 'left-end' = 'bottom-end';
	const [popperRef, popperContent] = createPopperActions({
		placement,
		strategy: 'fixed'
	});

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
	export let buttonActions: Action[] = [];

	export let icons: 'solid' | 'outline' = 'solid';

	export let usePortal = true;
</script>

<Menu let:open>
	<MenuButton
		use={[popperRef, ...buttonActions]}
		class="group relative z-10 flex items-center rounded-md p-1.5 hover:bg-gray-200 focus:bg-gray-200 focus:ring dark:hover:bg-gray-700 dark:focus:bg-gray-700 {open &&
			'bg-gray-200 dark:bg-gray-700'}"><slot /></MenuButton
	>
	{#if open}
		<div use:portal class="fixed inset-0 z-10" />
	{/if}
	{#if open}
		<div class="relative z-20" use:popperContent use:portal>
			<Transition
				show={open}
				enter="transition duration-100 ease-out"
				enterFrom="transform scale-95 opacity-0"
				enterTo="transform scale-100 opacity-100"
				leave="transition duration-75 ease-out"
				leaveFrom="transform scale-100 opacity-100"
				leaveTo="transform scale-95 opacity-0"
			>
				<MenuItems
					static
					class="z-20 mt-2 flex w-56 origin-top-right scale-100 transform flex-col divide-y divide-gray-100 rounded-md bg-white py-1 opacity-100 shadow-lg ring-1 ring-black/5 focus:outline-none dark:divide-gray-700 dark:bg-gray-800 dark:text-current dark:ring-white/5"
				>
					<!-- can either slot in items yourself, or let component do it for you -->
					<slot name="items" />
					{#each items as group}
						<div class="py-1 px-1">
							{#each group as { href, label, icon, iconProps, perform }}
								<MenuItem let:active>
									<div
										class="flex h-8 cursor-default select-none items-center space-x-3 rounded px-3 text-sm text-gray-900 dark:text-gray-100 {active
											? 'bg-gray-100 dark:bg-gray-700'
											: ''}"
										on:click={perform}
									>
										{#if iconProps}
											<Icon name={icon} {...iconProps} />
										{:else}
											<Icon
												className={icons === 'solid'
													? 'h-4 w-4 fill-current'
													: 'h-4 w-4 stroke-2 stroke-gray-500 dark:stroke-gray-400'}
												name={icon}
											/>
										{/if}
										{#if href}
											<a sveltekit:prefetch {href}>{label}</a>
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
			</Transition>
		</div>
	{/if}
</Menu>
