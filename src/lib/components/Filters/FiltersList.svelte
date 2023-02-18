<script lang="ts">
	import type { createFilterStores } from "$lib/stores/filter";
	import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@rgossiaux/svelte-headlessui";
	import type { ComponentProps } from "svelte";
	import Button from "../Button.svelte";
	import GenericListbox from "../helpers/GenericListbox.svelte";
	import Icon from "../helpers/Icon.svelte";
	import FilterDisplay from "./FilterDisplay.svelte";

	type T = $$Generic<Record<PropertyKey, any>>;
	export let filters: ReturnType<typeof createFilterStores<T>>["filters"];

	let is = ["is", "is not"];

	interface $$Props extends ComponentProps<FilterDisplay<T>> {
		filters: ReturnType<typeof createFilterStores<T>>["filters"];
	}

	$: console.log({ $filters });
</script>

<div class="flex gap-1">
	{#each $filters as filter (filter.id)}
		<div class="flex h-6 max-w-min shrink items-stretch gap-0.5 truncate rounded text-xs ">
			<div class="flex items-center gap-1 bg-gray-700 px-1.5">
				{#if filter.icon}
					<Icon name={filter.icon} className="h-4 w-4 fill-gray-600" />
				{/if}
				{#if filter.parent}
					{filter.parent}
				{/if}
			</div>
			{#if filter.boolean !== false}
				<GenericListbox
					class="flex items-center bg-gray-700 px-1.5"
					let:value
					value={Number(!filter.is) || 0}
					values={[0, 1]}
					onChange={(v) => (filter.is = !v)}
				>
					<button slot="button">{filter.is === false ? "is not" : "is"}</button>
					<div>
						{is[value]}
					</div>
				</GenericListbox>
			{/if}
			<span class="flex items-center bg-gray-700 px-1.5">
				{filter.name}
			</span>
			<button class="flex items-center bg-gray-700 px-1.5" on:click={() => filters.remove(filter.id)}
				><Icon name="xMarkMini" className="h-4 w-4 fill-gray-400" /></button
			>
		</div>
	{/each}
	{#if $filters.length}
		<FilterDisplay class="flex items-center" {filters} {...$$restProps}>
			<button class="group flex h-full items-center rounded px-0.5 hover:bg-gray-100 dark:hover:bg-gray-700">
				<Icon name="plusMini" className="h-4 w-4 fill-gray-500 group-hover:fill-gray-200" />
			</button>
		</FilterDisplay>
	{/if}
</div>
