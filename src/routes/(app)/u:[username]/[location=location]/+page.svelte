<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import CustomizeView from "$lib/components/CustomizeView.svelte";
	import EntryList from "$lib/components/EntryList.svelte";
	import Filter from "$lib/components/Filter.svelte";
	import Header from "$lib/components/layout/Header.svelte";
	import DefaultHeader from "$lib/components/layout/headers/DefaultHeader.svelte";
	import LocationListbox from "$lib/components/LocationListbox.svelte";
	import EntryFilter from "$lib/features/entries/EntryFilter.svelte";
	import { useFilterQuery } from "$lib/features/entries/filter";
	import { entriesByLocationQuery } from "$lib/features/entries/queries";
	import Filters from "$lib/features/filters/Filters.svelte";
	import { getCurrentListContext } from "$lib/stores/currentList";
	import { trpcWithQuery } from "$lib/trpc/client";
	import { LOCATION_TO_DISPLAY } from "$lib/types/schemas/Locations";
	import {
		createCustomizeViewStore,
		defaultViewOptions,
		sortEntries,
		ViewOptionsContextKey,
		type ViewOptions,
	} from "$lib/types/schemas/View";
	import { groupBy } from "$lib/utils";
	import type { Prisma } from "@prisma/client";
	import { createQuery } from "@tanstack/svelte-query";
	import SuperJSON from "superjson";
	import { setContext } from "svelte";
	import type { PageData } from "./$types";
	export let data: PageData;
	$: ({ location } = data);
	// this shouldn't be necessary, since we're requesting from the server - but maybe good to keep in case we want to do something client-side?
	// $: sortedArticles = articles.filter((a) => a.location === location);
	let viewOptions: ViewOptions = defaultViewOptions;
	// $: console.log({ data });
	$: locationStateIds = $page.data.user?.states?.filter((s) => s.type === location).map((s) => s.id) ?? [];
	// $: console.log({ $currentList });

    const current_list = getCurrentListContext();



	$: query = trpcWithQuery($page).entries.listBookmarks.createQuery({
				location: data.location,
		  });

	$: console.log({ $query });
    $: console.log('groupby', groupBy($query.data || [], (e) =>e.bookmarks?.[0]?.state?.name ?? "n"))

	const startingFilter: Prisma.EntryWhereInput = {
		bookmarks: {
			some: {
				userId: $page.data.user?.id ?? "n",
				state:
					location !== "all"
						? {
								type: location,
						  }
						: undefined,
			},
		},
	};
	$: console.log({ filter: SuperJSON.stringify(startingFilter) });
	let filters: Prisma.EntryWhereInput[] = [startingFilter];

	const viewOptionsStore = createCustomizeViewStore();
	setContext(ViewOptionsContextKey, viewOptionsStore);

	$: sortedEntries = $query.isSuccess ? sortEntries($query.data, $viewOptionsStore.sort).filter((e) => {
			const stateId = e.bookmarks?.[0]?.stateId;
			if (!stateId) return true;
            return locationStateIds.includes(stateId)
		}) : [];

    $: current_list.set({
        entries: sortedEntries,
        slug: $page.url.pathname
    })
</script>

<Header>
	<DefaultHeader>
		<div slot="start" class="flex items-center gap-2">
			<LocationListbox
				{location}
				on:change={(e) => {
					location = e.detail;
					goto(`/u:${$page.params.username}/${location.toLowerCase()}`);
				}}
			/>
		</div>
		<div slot="end" class="flex">
			<Filter />
			<CustomizeView bind:viewOptions={$viewOptionsStore} />
		</div>
	</DefaultHeader>
</Header>

<Filters />

<EntryFilter />
{#if $query.isLoading}
	<div>Loading...</div>
{:else if $query.isError}
	<div>Error</div>
{:else if $query.isSuccess}
{JSON.stringify($query.data)}
	<!-- <EntryList
		items={sortedEntries}
	>
		<svelte:fragment slot="empty">No entries in {LOCATION_TO_DISPLAY[location]}</svelte:fragment>
	</EntryList> -->
{/if}
<!-- <EntryList items={data.entries}>
	<svelte:fragment slot="empty">No entries in {LOCATION_TO_DISPLAY[location]}</svelte:fragment>
</EntryList> -->
