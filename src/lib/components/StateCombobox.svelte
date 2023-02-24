<script lang="ts">
	import { invalidateAll } from "$app/navigation";
	import { page } from "$app/stores";
	import SmallPlus from "$lib/components/atoms/SmallPlus.svelte";
	import Icon from "$lib/components/helpers/Icon.svelte";
	import mq from "$lib/stores/mq";
	import { syncStore } from "$lib/stores/sync";
	import type { Tooltip } from "$lib/stores/Tooltips";
	import { trpc } from "$lib/trpc/client";
	import { LOCATION_TO_ICON_SOLID } from "$lib/types/schemas/Locations";
	import type { State } from "@prisma/client";
	import { Popover, PopoverButton, PopoverPanel } from "@rgossiaux/svelte-headlessui";
	import { createPopperActions } from "svelte-popperjs";
	import GenericCombobox from "./GenericCombobox.svelte";
	import { match, P } from "ts-pattern";
	import HiddenInput from "./atoms/HiddenInput.svelte";
	import { tweened } from "svelte/motion";

	export let state = $page.data.user?.states?.find((s) => s.id === $page.data.user?.default_state_id);
    export let unsaved = false;
	$: console.log({ state, $page });
	$: name = state?.name;
	$: location = state?.type;
	export let states = $page.data.user?.states || [];

	export let label = true;
	export let includeIcon = true;
	let className = "";
	export { className as class };
	export let size: "xs" | "sm" | "base" = "sm";
	export let tooltip: Tooltip | undefined = undefined;
	export let onSelect: ((state: State) => void) | undefined = undefined;

	const [popperRef, popperContent] = createPopperActions();

	// Example Popper configuration
	const popperOptions = {
		placement: "bottom-start",
		strategy: "absolute",
		modifiers: [{ name: "offset", options: { offset: [0, 10] } }],
	};

	$: console.log({ location, states });

	let combobox: HTMLElement;

	$: console.log({ $mq });

	let isOpen = false;

	// REVIEW: instead of passing stores down the component ladder, would context be better suited for this?

	let height = tweened(200, {
		duration: 125,
	});
</script>

<!-- <GenericCombobox /> -->

<!-- TODO: progressive enhancement version (simple select and go) -->
{#if state}
	<Popover --height={$height}>
		<input type="hidden" name="state" value={state.id} />
		<PopoverButton
			class="relative flex cursor-default items-center gap-1 rounded py-1 px-2 text-left transition hover:bg-gray-200 focus-visible:bg-gray-200 focus-visible:ring-2   dark:hover:bg-gray-700 dark:focus-visible:bg-gray-700 dark:focus-visible:ring-offset-stone-900"
			use={[popperRef]}
		>
        {#if unsaved}
        unsaved
        {:else}
			{#if includeIcon}
				<Icon name={LOCATION_TO_ICON_SOLID[location]} className="h-4 w-4 fill-gray-600 dark:fill-gray-500" />
			{/if}
			{#if label}
				<SmallPlus {size}>{name}</SmallPlus>{/if}
                {/if}
		</PopoverButton>
		<PopoverPanel
			let:close
			class="z-50 h-[calc(var(--height)*1px)] text-sm"
			use={[[popperContent, popperOptions]]}
		>
			<GenericCombobox
				bind:ref={combobox}
				bind:height
				static
				autofocus
				values={states}
				placeholder="Change status…"
				selectedValue={[state]}
				onSelect={async (e) => {
					state = e;
					// close
					close(null);
					if (onSelect) {
						onSelect(e);
					}
				}}
				let:value
				let:selected
				let:active
			>
				<div class="flex h-8 items-center gap-2 px-2 text-sm">
					<Icon
						className="h-4 w-4 {active ? 'fill-gray-100' : 'fill-gray-400'}"
						name={LOCATION_TO_ICON_SOLID[value.type]}
					/>

					<span class="grow {active ? 'text-gray-100' : 'text-gray-400'}">{value.name}</span>
					{#if selected}
						<Icon name="checkMini" className="h-4 w-4 fill-gray-400" />
					{/if}
				</div>
			</GenericCombobox>
		</PopoverPanel>
	</Popover>
	<noscript>
		<!-- select menu here (and don't render above) -->
	</noscript>
	<!--
<Listbox
	value={state.id}
	on:change={(e) => (state = states.find((s) => s.id === e.detail) || state)}
	on:change
	class={className}
>
	<HiddenInput name="location" value={name} />
	<ListboxLabel class="sr-only">Current location:</ListboxLabel>
	<TooltipRef {tooltip}>
		<ListboxButton
			class="relative flex cursor-default items-center gap-1 rounded py-1 px-2 text-left transition focus-visible:ring-2  {variant ===
			'naked'
				? 'hover:bg-gray-200 focus-visible:bg-gray-200   dark:hover:bg-gray-700 dark:focus-visible:bg-gray-700 dark:focus-visible:ring-offset-stone-900'
				: 'border border-gray-300 shadow-sm dark:border-gray-600 dark:bg-gray-700'}"
		>
			{#if includeIcon}
				<Icon
					name={LOCATION_TO_ICON_SOLID[location]}
					className="h-4 w-4 fill-gray-600 dark:fill-gray-500"
				/>
			{/if}
			{#if label}
				<SmallPlus {size}>{name}</SmallPlus>{/if}
		</ListboxButton>
	</TooltipRef>
	<ListboxOptions
		class="absolute z-20 mt-1 flex min-w-min flex-col overflow-hidden rounded-lg bg-gradient-to-br from-gray-100 to-gray-50 text-sm shadow-2xl ring-1 ring-black/5 focus:outline-none dark:from-gray-900 dark:to-gray-800 dark:text-gray-50 dark:shadow-stone-900"
	>
		{#each states as state (state.id)}
			<ListboxOption
				class={({ active }) =>
					`flex cursor-default items-center space-x-3 py-1.5 pl-3 pr-5 ${
						active && 'bg-gray-200 dark:bg-gray-700'
					}`}
				value={state.id}
				let:active
				style="--state-color: {state.color || '#57534e'};"
			>
				<Icon
					name={LOCATION_TO_ICON_SOLID[state.type]}
					className="h-4 w-4 fill-[var(--state-color)] {active &&
						'dark:fill-gray-100 fill-gray-900'}"
				/>
				<span>{state.name}</span>
			</ListboxOption>
		{/each}
	</ListboxOptions>
</Listbox> -->
{/if}
