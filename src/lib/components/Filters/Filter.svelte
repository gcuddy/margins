<script lang="ts">
	import { page } from "$app/stores";
	import { createFilterStores, StringKeys } from "$lib/stores/filter";
	import {
		createEventDispatcher,
		onDestroy,
		onMount,
		setContext,
	} from "svelte";
	import type { ChildOption } from "./SimpleFilter.svelte";

	type T = $$Generic<Record<PropertKey, any>>;
	export let values: T[];
	export let searchKeys: StringKeys<T>[] = [];

	// export let stores: Parameters<typeof createFilterStores>[0];

	// TODO: stores/filtering should probably occur in header.
	const filterMap = $page.data.filterMap;
	console.log({ filterMap });
	const savedFilters = $filterMap?.get($page.route.id || "");
	console.log({ savedFilters });
	let stores = createFilterStores(
		{ data: values, filters: savedFilters },
		...searchKeys
	);
	// $: console.log({ stores });
	const dispatch = createEventDispatcher<{
		filter: typeof values;
	}>();
	const { items, filteredItems, any, filters, searchTerm } = stores;
	$: console.log({ $filters });

	// if (map_key && filterMap && $page.route.id) {
	// 	$filterMap?.set($page.route.id, filters);
	// 	console.log({ filterMap });
	// }

	$: values, items.set(values);

	const unsubscribeFilteredItems = filteredItems.subscribe(($filteredItems) => {
		dispatch("filter", $filteredItems);
	});

	// let chosenFilters: ChildOption<T>[] = [];
	// feels like i should be able to bind directly, but ah well — look at the types. extending doesn't work.
	// $: chosenFilters, ($filters = chosenFilters);

	setContext("filter", stores);

	interface $$Slots {
		default: {
			items: typeof items;
			filteredItems: typeof $filteredItems;
			any: typeof any;
			filters: typeof filters;
			searchTerm: typeof searchTerm;
			_filters: typeof $filters;
		};
	}

	onDestroy(() => {
		// set map
		console.log("destroying <Filter />");
		// Update filterMap to save current Filters in memory. Eventually maybe make this sync with IDB (but will need to serialize somehow?)
		if ($page.data.filterMap) {
			$page.data.filterMap.update((m) => {
				if ($page.route.id) {
					m.set($page.route.id, $filters);
				}
				return m;
			});
		}
		unsubscribeFilteredItems();
	});
</script>

<!-- <input type="text" bind:value={$searchTerm} /> -->

<!-- Parent Component: puts stores in context and allows other child components to grab onto them -->
<!-- Actually, let's use slot props instead. Exposes a bunch of slots. -->
<!-- expects FilterDisplay -->
<slot
	{items}
	filteredItems={$filteredItems}
	{any}
	{filters}
	_filters={$filters}
	{searchTerm}
/>
<!-- <FilterDisplay
	bind:filters={chosenFilters}
	options={[
		{
			id: "color",
			name: "Color",
			icon: "colorSwatch",
			multiple: true,
			options: color_values,
		},
	]}
/> -->
