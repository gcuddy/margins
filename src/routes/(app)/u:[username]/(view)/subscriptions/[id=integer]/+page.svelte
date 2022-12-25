<script lang="ts">
	import { page } from '$app/stores';
	import EntryList from '$lib/components/EntryList.svelte';
	import { currentList } from '$lib/stores/currentList';
	import type { ViewOptions } from '$lib/types/schemas/View';
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

<ul class="overflow-auto">
	<EntryList items={data.entries} viewOptions={DEFAULT_RSS_VIEW_OPTIONS} />
	<!-- {#each data.subscription.feed.entries as entry}
		<li
			on:mouseover={(e) => {
				if (!peek) return;
			}}
		>
			<RssListItem item={entry} feed={data.subscription.feed} />
		</li>
	{/each} -->
</ul>
