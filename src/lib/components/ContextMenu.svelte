<script lang="ts">
	import type { Action } from "$lib/actions/types";

	import type { PopperPlacement } from "$lib/types";

	import type { MenuItem as IMenuItem } from "$lib/types/schemas/Menu";
	import {
		Menu,
		MenuButton,
		MenuItem,
		MenuItems,
		Transition,
		TransitionChild
	} from "@rgossiaux/svelte-headlessui";
	import { createEventDispatcher } from "svelte";
	import { createPopperActions } from "svelte-popperjs";
	import Portal from "svelte-portal";
	import { fade } from "svelte/transition";
	import Icon from "./helpers/Icon.svelte";

	export let placement: PopperPlacement = "bottom-end";
	export let strategy: "fixed" | "absolute" = "fixed";
	const dispatch = createEventDispatcher<{
		select: IMenuItem;
	}>();
	export let offset: [number, number] | undefined = undefined;
	const [popperRef, popperContent] = createPopperActions({
		placement,
		strategy,
		modifiers: [
			{
				name: "offset",
				options: {
					offset,
				},
			},
			{
				name: "arrow",
			},
		],
	});

	export let overlayClass = "";

	export let items: IMenuItem[][];
	export let buttonActions: Action[] = [];

	export let icons: "solid" | "outline" = "solid";

	export let squishy = false;

	let className = "p-1.5";
	export { className as class };
	export let active_styling = true;
</script>

<Menu let:open>
	<slot name="button">
		<MenuButton
			use={[popperRef, ...buttonActions]}
			class="group relative z-10 flex items-center rounded-md  {className} {active_styling
				? 'hover:bg-gray-200 focus:bg-gray-200 focus:ring active:ring-0 dark:hover:bg-gray-600 dark:focus:bg-gray-600 dark:active:text-white'
				: ''} {squishy ? 'transition duration-300 active:scale-95' : ''} {open && active_styling
				? 'bg-gray-200 dark:bg-gray-600'
				: ''}"><slot /></MenuButton
		>
	</slot>
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
		<Portal>
			{#if open}
				<div class="relative z-50" out:fade={{ duration: 150 }} use:popperContent>
					<!-- <TransitionChild
						enter="transition duration-100 ease-out"
						enterFrom="transform scale-95 opacity-0"
						enterTo="transform scale-100 opacity-100"
						leave="transition duration-75 ease-out"
						leaveFrom="transform scale-100 opacity-100"
						leaveTo="transform scale-95 opacity-0"
					> -->
					<MenuItems
						static
						class="z-20 mt-2 flex w-56 origin-top-right scale-100 transform flex-col divide-y divide-gray-100 rounded-md bg-gray-50/90 py-1 opacity-100 shadow-xl ring-1 ring-black/5 backdrop-blur-sm focus:outline-none  dark:divide-gray-700 dark:bg-zinc-900/50 dark:text-current dark:ring-gray-400/20 dark:backdrop-blur-md dark:backdrop-brightness-75 dark:backdrop-contrast-75 dark:backdrop-saturate-200 "
					>
						<!-- can either slot in items yourself, or let component do it for you -->
						<slot name="items" />
						{#each items as group}
							<div class="flex flex-col px-1 ">
								{#each group.filter( (g) => (g.check ? g.check() : true) ) as { href, label, icon, iconProps, perform, items }}
									<MenuItem
										as={href ? "a" : "button"}
                                        href={href ? href : undefined}
										let:active
										on:click={perform}
										class={({ active }) =>
											`flex h-8 cursor-default select-none items-center space-x-3 rounded-lg px-2 text-sm font-medium text-gray-900 dark:text-gray-50 ${
												active ? "bg-primary-300/30 dark:bg-gray-500/20" : ""
											}`}
									>
										{#if icon}
											{#if iconProps}
												<Icon name={icon} {...iconProps} />
											{:else}
												<Icon
													className={icons === "solid"
														? `h-4 w-4 dark:fill-gray-400 fill-gray-500 ${
																active ? "fill-gray-600 dark:fill-gray-300" : ""
														  }`
														: "h-4 w-4 stroke-2 stroke-gray-500 dark:stroke-gray-400"}
													name={icon}
												/>
											{/if}
										{/if}
										<span class="cursor-default">
                                            {label}
											<!-- {#if href}
												<a {href}>{label}</a>
											{:else}
												{label}
											{/if} -->
										</span>
										<!-- {#if items?.length}
												<div class="ml-auto" />
												<Icon name="chevronRightMini" className="h-4 w-4 fill-gray-400" />
											{/if} -->
										<!-- TODO: should look into wai-aria for nested menu. Right now it looks like it's impossible with headless-ui in the way Linear does it. -->
										<!-- settling for a weird version with clicks and sub-menu (not displayed to right) -->
									</MenuItem>
								{/each}
							</div>
						{/each}
					</MenuItems>
					<!-- </TransitionChild> -->
				</div>
			{/if}
		</Portal>
	</Transition>
</Menu>
