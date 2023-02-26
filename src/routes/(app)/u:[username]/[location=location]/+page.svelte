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
	import { trpcWithQuery } from "$lib/trpc/client";
	import { LOCATION_TO_DISPLAY } from "$lib/types/schemas/Locations";
	import { defaultViewOptions, type ViewOptions } from "$lib/types/schemas/View";
	import type { Prisma } from "@prisma/client";
	import { createQuery } from "@tanstack/svelte-query";
	import SuperJSON from "superjson";
	import type { PageData } from "./$types";
	export let data: PageData;
	$: ({ location } = data);
	// this shouldn't be necessary, since we're requesting from the server - but maybe good to keep in case we want to do something client-side?
	// $: sortedArticles = articles.filter((a) => a.location === location);
	let viewOptions: ViewOptions = defaultViewOptions;
	// $: console.log({ data });
	$: data.currentList.set({
		// type: 'bookmarks',
		slug: $page.url.pathname,
		// ids: data.entries.map((e) => e.id),
		// items: data.entries,
	});
	$: currentList = data.currentList;
	$: locationStateIds = $page.data.user?.states?.filter((s) => s.type === location).map((s) => s.id) ?? [];
	// $: console.log({ $currentList });

	$: query = data.query
		? data.query()
		: trpcWithQuery($page).entries.listBookmarks.createQuery({
				location: data.location,
		  });

	$: console.log({ $query });

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
			<button
				on:click={() => {
					filters = [
						...filters,
						{
							author: {
								contains: "a",
							},
						},
					];
				}}>add filter</button
			>
		</div>
		<div slot="end" class="flex">
			<Filter />
			<CustomizeView bind:viewOptions />
		</div>
	</DefaultHeader>
</Header>

<Filters />

<EntryFilter />
<!-- {JSON.stringify(data.bookmarks, null, 2)} -->
<!-- <Saved
	items={data.entries || data.bookmarks || []}
	{viewOptions}
	on:update={(e) => {
		console.log('update', e);
		e.detail.articles.forEach((article) => {
			articles = articles.map((a) => (a.id === article.id ? article : a));
		});
	}}
/> -->
<!-- <Filters /> -->
{#if $query.isLoading}
	<div>Loading...</div>
{:else if $query.isError}
	<div>Error</div>
{:else if $query.isSuccess}
	<EntryList
		items={$query.data.filter((e) => {
			const stateId = e.bookmarks?.[0]?.stateId;
			console.log({ stateId, locationStateIds });
			if (!stateId) return true;
			if (locationStateIds.includes(stateId)) {
				return true;
			} else {
				return false;
			}
		})}
	>
		<svelte:fragment slot="empty">No entries in {LOCATION_TO_DISPLAY[location]}</svelte:fragment>
	</EntryList>
{/if}
<!-- <EntryList items={data.entries}>
	<svelte:fragment slot="empty">No entries in {LOCATION_TO_DISPLAY[location]}</svelte:fragment>
</EntryList> -->
