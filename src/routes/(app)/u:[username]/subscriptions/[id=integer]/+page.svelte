<script lang="ts">
	import { page } from "$app/stores";
	import EntryList from "$lib/components/EntryList.svelte";
	// import {
	// 	type FilterOption,
	// 	type ChildFilterOption,
	// 	buildFilter,
	// } from '$lib/components/Filters/Index.svelte';
	import type { createFilterStores } from "$lib/stores/filter";
	import type { ViewOptions } from "$lib/types/schemas/View";
	import { getContext } from "svelte";
	import type { PageData } from "./$types";
	export let data: PageData;

	$: console.log({ data });

	let peek = false;

	$: subscription = data.subscriptions.find((s) => s.feedId === +$page.params.id);

	// $: currentList = $page.data.currentList;
	// $: console.log({ $currentList });
	// $: currentList = data.currentList;
	// $: currentList.set({
	// 	type: "rss",
	// 	slug: $page.url.pathname,
	// 	ids: data.entries.map((e) => e.id),
	// });
	// $: data.currentList.set({
	// 	items: data.entries,
	// 	slug: $page.url.pathname,
	// 	type: 'rss',
	// 	feed: data.subscription.feed,
	// 	subscription: data.subscription,
	// });

	// $: unreads = $entries.filter((e) => e.unread);

	const DEFAULT_RSS_VIEW_OPTIONS: ViewOptions = {
		view: "list",
		sort: "published",
		properties: {
			author: false,
			site: false,
			description: true,
			tags: true,
			wordCount: false,
			date: true,
			image: false,
			readProgress: true,
			location: false,
			pageNote: false,
			url: false,
			annotationCount: true,
		},
	};

	$: only_unread = Boolean($page.url.searchParams.get("unread"));

	// get filter context (since we can't use slot props here from root layout)
	const stores: ReturnType<typeof createFilterStores<(typeof data)["entries"][number]>> =
		getContext("filter");
	const { filteredItems } = stores;
	// let filters = writable<ChildFilterOption[]>([]);

	// $: filteredItems = $entries.filter((i) => $filters.every((f) => buildFilter(f)(i)));
</script>

<!-- <svelte:window
	on:keydown={(e) => {
		if (e.key === ' ') {
			peek = !peek;
		} else {
			peek = false;
		}
	}}
/> -->

<!-- <div class="flex justify-between px-8 py-1">
	<div class="grid">
		{#if $filters.length}
			<div class="col-start-1 row-start-1" transition:fade={{ duration: 100 }}>
				<Button
					variant="dashed"
					on:click={() => {
						filters.set([]);
					}}>Clear filters</Button
				>
			</div>
		{:else}
			<div class="col-start-1 row-start-1" transition:fade={{ duration: 100 }}>
				<FilterPopover items={data.entries} bind:filters />
			</div>
		{/if}
	</div>
	<CustomizeView />
</div> -->
<!-- <div class="flex gap-2 px-8 py-1">
	Test
	{#each $filters as filter}
		<FilterCondition
			{filter}
			onDelete={() => ($filters = $filters.filter((f) => f.id !== filter.id))}
		/>
	{/each}
	{#if $filters.length}
		<FilterPopover items={data.entries} bind:filters>
			<Button variant="naked" className="h-5 w-5">
				<Icon name="plusSm" />
			</Button>
		</FilterPopover>
	{/if}
</div> -->

<EntryList
	items={$filteredItems.map((i) => ({ ...i, image: i.image || data.subscription?.feed.imageUrl || null }))}
	viewOptions={DEFAULT_RSS_VIEW_OPTIONS}
/>

<!-- {#each data.entries as item (item.id)}
	<a href="/u:{data.user.username}/entry/{item.id}">{item.title}</a>
{/each} -->
