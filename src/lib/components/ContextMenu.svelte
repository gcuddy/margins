<script lang="ts">
	import type { Action } from '$lib/actions/types';

	import type { IconName } from '$lib/icons';
	import type { ComponentProperties } from '$lib/stores/types';
	import { fadeScale } from '$lib/transitions';
	import type { PopperPlacement } from '$lib/types';

	import {
		Menu,
		MenuButton,
		MenuItems,
		MenuItem,
		Transition,
		TransitionChild,
	} from '@rgossiaux/svelte-headlessui';
	import { createPopperActions } from 'svelte-popperjs';
	import { portal } from 'svelte-portal';
	import { fade, fly, scale } from 'svelte/transition';
	import Icon from './helpers/Icon.svelte';

	export let placement: PopperPlacement = 'bottom-end';
	export let strategy: 'fixed' | 'absolute' = 'fixed';
	const [popperRef, popperContent] = createPopperActions({
		placement,
		strategy,
	});

	export let overlayClass = '';

	interface MenuItem {
		label: string;
		icon?: IconName;
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

	export let squishy = false;
</script>

<Menu let:open>
	<MenuButton
		use={[popperRef, ...buttonActions]}
		class="group relative z-10 flex items-center rounded-md p-1.5 hover:bg-gray-200 focus:bg-gray-200 focus:ring active:ring-0 dark:hover:bg-gray-600 dark:focus:bg-gray-600 dark:active:text-white {squishy
			? 'active:scale-95 transition duration-300'
			: ''} {open && 'bg-gray-200 dark:bg-gray-600'}"><slot /></MenuButton
	>
	<Transition show={open}>
		{#if open}
			<TransitionChild
				enter="ease-out duration-300"
				enterFrom="opacity-0"
				enterTo="opacity-100"
				leave="ease-in duration-200"
				leaveFrom="opacity-100"
				leaveTo="opacity-0"
			>
				<div class="fixed inset-0 z-10 {overlayClass}" />
			</TransitionChild>
		{/if}
		{#if open}
			<div class="relative z-20" use:popperContent>
				<TransitionChild
					enter="transition duration-100 ease-out"
					enterFrom="transform scale-95 opacity-0"
					enterTo="transform scale-100 opacity-100"
					leave="transition duration-75 ease-out"
					leaveFrom="transform scale-100 opacity-100"
					leaveTo="transform scale-95 opacity-0"
				>
					<MenuItems
						static
						class="z-20 mt-2 flex w-56 origin-top-right scale-100 transform flex-col divide-y divide-gray-100 rounded-md bg-white py-1 opacity-100 shadow-xl ring-1 ring-black/5 focus:outline-none dark:divide-gray-700 dark:bg-gradient-to-br dark:from-gray-700 dark:to-gray-800 dark:text-current dark:ring-white/20"
					>
						<!-- can either slot in items yourself, or let component do it for you -->
						<slot name="items" />
						{#each items as group}
							<div class="p-2">
								{#each group as { href, label, icon, iconProps, perform }}
									<MenuItem let:active>
										<div
											class="flex h-8 cursor-default select-none items-center space-x-3 rounded-lg px-3 text-sm font-medium text-gray-900 dark:text-gray-50 {active
												? 'bg-gray-200 dark:bg-gray-600'
												: ''}"
											on:click={perform}
										>
											{#if icon}
												{#if iconProps}
													<Icon name={icon} {...iconProps} />
												{:else}
													<Icon
														className={icons === 'solid'
															? `h-4 w-4 dark:fill-gray-400 fill-gray-500 ${
																	active ? 'fill-gray-600 dark:fill-gray-300' : ''
															  }`
															: 'h-4 w-4 stroke-2 stroke-gray-500 dark:stroke-gray-400'}
														name={icon}
													/>
												{/if}
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
				</TransitionChild>
			</div>
		{/if}
	</Transition>
</Menu>
