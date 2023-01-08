<script lang="ts">
	import {
		Listbox,
		ListboxButton,
		ListboxOptions,
		ListboxOption,
		ListboxLabel,
	} from '@rgossiaux/svelte-headlessui';
	import {
		LOCATIONS,
		LOCATIONS_WITH_ALL,
		LOCATION_TO_DISPLAY,
		LOCATION_TO_ICON_SOLID,
		type Location,
	} from '$lib/types/schemas/Locations';
	import SmallPlus from '$lib/components/atoms/SmallPlus.svelte';
	import Icon from '$lib/components/helpers/Icon.svelte';
	import HiddenInput from './atoms/HiddenInput.svelte';
	import TooltipRef from './TooltipRef.svelte';
	import type { Tooltip } from '$lib/stores/Tooltips';
	import type { State } from '@prisma/client';
	import { page } from '$app/stores';
	export let state: State;
	$: name = state.name;
	$: location = state.type;
	export let states: State[] = $page.data.states || [];
	export let includeAll = true;
	export let label = true;
	export let includeIcon = true;
	export let variant: 'naked' | 'button' = 'naked';
	let className = '';
	export { className as class };
	export let size: 'xs' | 'sm' | 'base' = 'sm';
	export let tooltip: Tooltip | undefined = undefined;

	$: console.log({ location });
</script>

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
</Listbox>
