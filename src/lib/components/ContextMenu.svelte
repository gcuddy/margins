<script lang="ts">
	import type { Action } from '$lib/actions/types';

	import type { IconName } from '$lib/icons';
	import type { ComponentProperties } from '$lib/stores/types';
	import { fadeScale } from '$lib/transitions';

	import { Menu, MenuButton, MenuItems, MenuItem } from '@rgossiaux/svelte-headlessui';
	import { createPopperActions } from 'svelte-popperjs';
	import { fade, fly, scale } from 'svelte/transition';
	import Icon from './helpers/Icon.svelte';
	const [popperRef, popperContent] = createPopperActions({
		placement: 'bottom-end',
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
	$: console.log({ items });

	export let icons: 'solid' | 'outline' = 'solid';
</script>

<Menu let:open>
	<MenuButton
		use={[popperRef, ...buttonActions]}
		class="group flex items-center rounded-md p-1.5 hover:bg-gray-200 focus:bg-gray-200 {open &&
			'bg-gray-200'}"><slot /></MenuButton
	>
	{#if open}
		<div class="fixed inset-0 z-10" />
	{/if}
	{#if open}
		<div class="relative z-20" use:popperContent>
			<div
				transition:fadeScale={{
					duration: 150,
					baseScale: 0.95
				}}
			>
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
			</div>
		</div>
	{/if}
</Menu>
