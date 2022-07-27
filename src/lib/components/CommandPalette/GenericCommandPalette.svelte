<script lang="ts">
	const dispatch = createEventDispatcher<{
		select: TValue;
	}>();
	type T = $$Generic;

	// two different ways to handle this:
	// 1. require perform key per item
	// 2. pass on:select / onSelect with item

	// TODO: GENERIC ACTION TYPE
	// TODO: fix TValue troubles
	type TValue = T & {
		name?: string;
		title?: string;
		id?: string;
		check?: () => boolean;
		keywords?: string;
		kbd?: string[][];
	};
	// allows stores to be passed in; we will read them
	export let values: TValue[] | Writable<TValue[]> | Readable<TValue[]>;
	//todo: export function to search value (for derived store)

	export let onSelect = (e: CustomEvent<TValue>) => {
		dispatch('select', e.detail);
	};

	// this can be disabled if you want to handle it yourself
	export let closeOnSelect = true;
	// TODO: expand on this open to be more like stacking modals
	export let open = true;

	// optional Raw html or StoredComponent to display per item
	export let itemDisplay:
		| ((
				value: TValue,
				active: boolean,
				selected: boolean,
				index: number
		  ) => string | StoredComponent)
		| null = null;

	// optionally set an icon ot display for each item, using a stored component
	export let itemIcon:
		| (<TT>(
				value: TValue,
				active: boolean,
				selected: boolean,
				index: number
		  ) => StoredComponentTyped<TT>)
		| null = null;

	// optionally, return a string to prefetch when that item is active (for performance but more network requests)
	let prefetchProp: ((value: TValue) => string) | null = null;
	export { prefetchProp as prefetch };

	/** STORE SETUP (maybe put in sep file or module) **/
	export let term = writable('');
	const commandStore = Array.isArray(values) ? writable<TValue[]>(values) : values;
	console.log({ commandStore, $commandStore });
	//TODO Use Fuse
	// TODO: fix type problems
	const filteredActions = derived([term, commandStore], ([$term, $items]) => {
		$items = $items?.filter((i) => !('check' in i) || i?.check?.());
		return $items?.filter((x) =>
			((x?.name || x?.title) + (x?.keywords || '')).toLowerCase().includes($term.toLowerCase())
		);
	});

	import Combobox from '../helpers/Combobox.svelte';
	import { fadeScale } from '$lib/transitions';
	import { derived, writable, type Readable, type Writable } from 'svelte/store';
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';
	import type { StoredComponent, StoredComponentTyped } from '$lib/stores/types';
	import { prefetch } from '$app/navigation';

	function commandListener({ detail: e }: CustomEvent<KeyboardEvent>) {
		if (e.key === 'Escape') {
			open = false;
		}
	}

	export let placeholder: string = 'Search…';
</script>

<div transition:fadeScale={{ duration: 150, baseScale: 0.95 }}>
	<!-- TODO: make onselect a prop -->
	<Combobox
		values={$filteredActions || []}
		bind:value={$term}
		fillValue={false}
		on:select={(e) => {
			onSelect(e);
			if (closeOnSelect) {
				console.log('closing');
				open = false;
			}
		}}
		on:keydown={commandListener}
		on:active={(e) => {
			if (prefetchProp) {
				prefetch(prefetchProp(e.detail));
			}
		}}
		input={{
			class:
				'w-full bg-transparent text-lg border-0 focus:ring-0 text-gray-800 dark:text-gray-100 placeholder-gray-400  p-5',
			placeholder
		}}
		options={{
			class: `max-h-96 text-sm overflow-y-auto ${!$filteredActions?.length ? 'hidden' : ''}`
		}}
		static={true}
		expanded={true}
		class="relative mx-auto max-w-2xl divide-y divide-gray-100 overflow-hidden rounded-xl bg-gray-50 text-gray-900 shadow-2xl ring-1 ring-black/5 dark:divide-gray-600 dark:bg-gray-750 dark:text-gray-100"
	>
		<div slot="option" let:value let:active let:selected let:index>
			<slot {value} {active} {selected} {index}>
				<div
					class="text-gray-600 dark:text-gray-300 {active
						? 'bg-gray-200 text-gray-800 dark:bg-gray-600 dark:!text-white'
						: ''} flex h-12 w-full items-center gap-3.5 px-4 py-2"
				>
					{#if itemIcon}
						{@const { component, props } = itemIcon(value, active, selected, index)}
						{#if component}
							<svelte:component this={component} {...props} />
						{/if}
					{/if}
					<div class="grow-0 truncate">
						{#if itemDisplay}
							{@const item = itemDisplay(value, active, selected, index)}
							{#if typeof item === 'string'}
								{@html item}
							{:else}
								<svelte:component this={item.component} {...props} />
							{/if}
						{:else}
							{typeof value === 'string' ? value : value.name || value.title}
						{/if}
					</div>
					{#if value.kbd}
						<div class="flex">
							{#each value.kbd as shortcut}
								{#each shortcut as kbd}
									<kbd class="text-gray-600 dark:text-gray-300">{kbd}</kbd>
								{/each}
							{/each}
						</div>
					{/if}
				</div>
			</slot>
		</div>
	</Combobox>
</div>
