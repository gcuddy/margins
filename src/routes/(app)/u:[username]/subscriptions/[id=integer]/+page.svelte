<script lang="ts">
	import { page } from '$app/stores';
	import Muted from '$lib/components/atoms/Muted.svelte';
	import Button from '$lib/components/Button.svelte';
	import CustomizeView from '$lib/components/CustomizeView.svelte';
	import EntryList from '$lib/components/EntryList.svelte';
	import FilterCondition from '$lib/components/Filters/FilterCondition.svelte';
	import FilterPopover from '$lib/components/Filters/FilterPopover.svelte';
	import {
		type FilterOption,
		type ChildFilterOption,
		buildFilter,
	} from '$lib/components/Filters/Index.svelte';
	import Icon from '$lib/components/helpers/Icon.svelte';
	import { currentList } from '$lib/stores/currentList';
	import type { ViewOptions } from '$lib/types/schemas/View';
	import { writable } from 'svelte/store';
	import { fade } from 'svelte/transition';
	import RssListItem from '../FeedListItem.svelte';
	import type { PageData } from './$types';
	export let data: PageData;
	$: console.log({ data });

	let peek = false;

	// $: currentList = $page.data.currentList;
	// $: console.log({ $currentList });
	// $: currentList.set({
	// 	type: 'rss',
	// 	back: `/u:${$page.data.user?.username}/subscriptions/${$page.params.id}`,
	// 	items: data.subscription.feed.entries,
	// });
	$: data.currentList.set({
		items: data.entries,
		slug: $page.url.pathname,
		type: 'rss',
		feed: data.subscription.feed,
		subscription: data.subscription,
	});
	$: console.log({ $currentList });
	$: unreads = data.entries.filter((e) => e.unread);

	const DEFAULT_RSS_VIEW_OPTIONS: ViewOptions = {
		view: 'list',
		sort: 'published',
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

	$: only_unread = Boolean($page.url.searchParams.get('unread'));

	let filters = writable<ChildFilterOption[]>([]);

	$: filteredItems = data.entries.filter((i) => $filters.every((f) => buildFilter(f)(i)));
</script>

<svelte:window
	on:keydown={(e) => {
		if (e.key === ' ') {
			peek = !peek;
		} else {
			peek = false;
		}
	}}
/>

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
<!-- <EntryList items={filteredItems} viewOptions={DEFAULT_RSS_VIEW_OPTIONS} /> -->

{#each filteredItems as item (item.id)}
	<a href="/u:{data.user.username}/entry/{item.id}">{item.title}</a>
{/each}
