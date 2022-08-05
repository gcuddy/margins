<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { flip } from 'svelte/animate';
	import { page } from '$app/stores';
	import KeyboardNav from '$lib/components/helpers/KeyboardNav/KeyboardNav.svelte';
	import KeyboardNavItem from '$lib/components/helpers/KeyboardNav/KeyboardNavItem.svelte';

	import RssItem from '$lib/components/rss/RSSItem.svelte';
	import type { RssFeedWithItems, RssItemWithFeed } from '$lib/types/rss';
	import { sortByDomNode } from '$lib/utils/focus-management';
	import { sortItemsFromFeeds } from '$lib/utils/rss';
	import type { RssFeedItem } from '@prisma/client';
	import { onMount } from 'svelte';
	import Item from './[id=integer]/_Item.svelte';
	import { feedStore, subscribedFeedIds } from './_stores';
	export let feeds: RssFeedWithItems[] = [];
	feedStore.set(feeds);
	console.log({ feeds });
	let sortedItems: RssFeedItem[] = [];
	$: feeds, (sortedItems = sortItemsFromFeeds(feeds, $page.stuff.filter === 'unread'));
	let activeItem: RssFeedItem | undefined;
	function updateItemState(newItem: RssFeedItem) {
		const idx = sortedItems.findIndex((item) => item.id === newItem?.id);
		if (idx === -1) {
			return;
		}
		sortedItems[idx] = newItem;
	}
	$: activeItem, updateItemState(activeItem);
	$: console.log({ $page });
	let activeIndex = -1;
	$: console.log({ activeIndex });
	// RSS Fetcher needs to be a background job
	// on mount, fetch all feeds
	// fetch('/rss/feeds.json').then((res) => res.json());
	// onMount(() => {
	// 	fetch('/rss/refresh.json', {
	// 		headers: {
	// 			'Content-Type': 'application/json',
	// 			Accept: 'application/json'
	// 		}
	// 	})
	// 		.then((res) => res.json())
	// 		.then((feeds) => {
	// 			console.log(`got these refreshed feeds`);
	// 			console.log({ feeds });
	// 			invalidate('/rss');
	// 		});
	// });

	// testing - clean this up
	let value = '';
	$: value, (sortedItems = sortedItems.filter((item) => item.title?.toLowerCase().includes(value)));
</script>

<input type="text" bind:value />
<div class="grid-cols-12 overflow-auto lg:grid">
	<div class="col-span-3">
		<ul>
			<li><a href="/rss?filter=all">All</a></li>
			<li><a href="/rss?filter=unread">Unread</a></li>
			{#each feeds as feed (feed.id)}
				<li>
					<a href="/rss/{feed.id}">{feed.title}</a>
				</li>
			{/each}
		</ul>
	</div>
	<div class="col-span-3 overflow-auto">
		<KeyboardNav changeActiveOnHover={false} bind:activeIndex>
			<ul>
				{#each sortedItems as item, index (item.id)}
					<li
						animate:flip
						class="flex items-baseline space-x-3 p-2 {item.is_read ? 'opacity-50' : ''}"
					>
						<!-- TODO: get proper type for this (check endpoint) -->
						<!-- <span class=" relative top-1 h-4 w-4 shrink-0 rounded bg-red-400">
					</span> -->
						<!-- <img src="https://icon.horse/icon/?uri={item.link}" class="h-4 w-4 rounded" alt="" /> -->
						<KeyboardNavItem
							as="a"
							href="/rss/{item.rssFeedId}/{item.id}"
							class="flex h-full w-full flex-col line-clamp-3 focus:ring"
							on:click={(e) => {
								e.preventDefault();
								activeItem = item;
							}}
							{index}
						>
							<div class="text-xs uppercase text-gray-400">{item.RssFeed.title}</div>
							<div>{item.title || item.contentSnippet || item.summary}</div>
						</KeyboardNavItem>
					</li>
				{/each}
			</ul>
		</KeyboardNav>
	</div>
	<div class="col-span-6 overflow-auto">
		{#if activeItem}
			<!-- TODO: fix this type as well -->
			<RssItem bind:item={activeItem} />
		{/if}
	</div>
</div>
