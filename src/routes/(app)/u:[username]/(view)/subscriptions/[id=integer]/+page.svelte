<script lang="ts">
	import { page } from '$app/stores';
	import EntryList from '$lib/components/EntryList.svelte';
	import { currentList } from '$lib/stores/currentList';
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
		items: data.subscription.feed.entries,
		slug: $page.url.pathname,
		type: 'rss',
		feed: data.subscription.feed,
		subscription: data.subscription,
	});
	$: console.log({ $currentList });
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
	<EntryList items={data.subscription.feed.entries} />
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
