<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import CustomizeView from "$lib/components/CustomizeView.svelte";
	import Filter from "$lib/components/Filter.svelte";
	import ItemList from "$lib/components/ItemList.svelte";
	import Header from "$lib/components/layout/Header.svelte";
	import DefaultHeader from "$lib/components/layout/headers/DefaultHeader.svelte";
	import LocationListbox from "$lib/components/LocationListbox.svelte";
	import Button from "$lib/components/ui/Button.svelte";
	import { H1 } from "$lib/components/ui/typography";
	import EntryFilter from "$lib/features/entries/EntryFilter.svelte";
	import EntryListItem from "$lib/features/entries/EntryListItem.svelte";
	import Filters from "$lib/features/filters/Filters.svelte";
	import { getCurrentListContext } from "$lib/stores/currentList";
	import { trpcWithQuery } from "$lib/trpc/client";
	import {
		Tabs,
		TabsList,
		TabsTrigger,
		TabsContent,
	} from "$lib/components/ui/tabs";
	import {
		createCustomizeViewStore,
		defaultViewOptions,
		ViewOptionsContextKey,
		type ViewOptions,
	} from "$lib/types/schemas/View";
	import type { Prisma } from "@prisma/client";
	import { setContext } from "svelte";
	import type { PageData } from "./$types";
	export let data: PageData;
	$: ({ location } = data);
	// this shouldn't be necessary, since we're requesting from the server - but maybe good to keep in case we want to do something client-side?
	// $: sortedArticles = articles.filter((a) => a.location === location);
	let viewOptions: ViewOptions = defaultViewOptions;
	// $: console.log({ data });
	// $: locationStateIds = $page.data.user?.states?.filter((s) => s.type === location).map((s) => s.id) ?? [];
	// $: console.log({ $currentList });

	const current_list = getCurrentListContext();

	$: query = trpcWithQuery($page).entries.listBookmarks.createQuery({
		location: data.location,
	});

	$: console.log({ $query });
	// $: console.log('groupby', groupBy($query.data || [], (e) =>e.bookmarks?.[0]?.state?.name ?? "n"))

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
	let filters: Prisma.EntryWhereInput[] = [startingFilter];

	const viewOptionsStore = createCustomizeViewStore();
	setContext(ViewOptionsContextKey, viewOptionsStore);

	// $: sortedEntries = $query.isSuccess ? sortEntries($query.data, $viewOptionsStore.sort).filter((e) => {
	// 		const stateId = e.bookmarks?.[0]?.stateId;
	// 		if (!stateId) return true;
	//         return locationStateIds.includes(stateId)
	// 	}) : [];

	$: current_list.set({
		entries: $query.data ?? [],
		slug: $page.url.pathname,
	});

	const locations = ["Inbox", "Soon", "Later", "Archive"];
	$: index = locations
		.map((l) => l.toLowerCase())
		.indexOf(location.toLowerCase());
</script>

<!-- <Header>
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
</Header> -->
<div class="px-6 py-4">
	<!-- <H1>Library</H1> -->

	<Tabs
		on:change={(e) => {
			let locationIndex = e.detail;
			let location = locations[locationIndex].toLowerCase();
			goto(`/u:${$page.params.username}/${location}`);
		}}
		defaultIndex={index}
		class="h-full space-y-6"
	>
		<TabsList>
			{#each locations as location}
				<TabsTrigger as="a" href="/u:margins/{location.toLowerCase()}"
					>{location}</TabsTrigger
				>
			{/each}
		</TabsList>
		<svelte:fragment slot="panels">
			{#each locations as location}
				<TabsContent class="border-none p-0">
					<h2 class="text-2xl font-semibold tracking-tight">
						{location}
					</h2>
					<ItemList entries={$query.data ?? []} loading={$query.isLoading} />
				</TabsContent>
			{/each}
			<!-- <TabsContent
				>{#if $query.isLoading}
					<div>Loading...</div>
				{:else if $query.isError}
					<div>Error</div>
				{:else if $query.isSuccess}
					<ItemList entries={$query.data} />
				{/if}
			</TabsContent>
			<TabsContent /> -->
		</svelte:fragment>
	</Tabs>

	<Filters />

	<EntryFilter />
</div>
