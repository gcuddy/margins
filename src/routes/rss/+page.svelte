<script lang="ts" context="module">
	export const currentFeedList = writable<{
		title: string;
		href: string;
		items: RssFeedItem[];
	}>();
</script>

<script lang="ts">
	import { page } from '$app/stores';
	import { sortItemsFromFeeds } from '$lib/utils/rss';
	import type { RssFeedItem } from '@prisma/client';
	import { feedStore } from './_stores';
	import type { PageData } from './$types';
	import { writable } from 'svelte/store';

	export let data: PageData;
	let { feeds } = data;
	feedStore.set(feeds);
	console.log({ feeds });
	// let sortedItems: RssFeedItem[] = [];
	// // $: feeds, (sortedItems = sortItemsFromFeeds(feeds));
	// // let activeItem: RssFeedItem | undefined;
	// // function updateItemState(newItem: RssFeedItem) {
	// // 	const idx = sortedItems.findIndex((item) => item.id === newItem?.id);
	// // 	if (idx === -1) {
	// // 		return;
	// // 	}
	// // 	sortedItems[idx] = newItem;
	// // }
	// // $: activeItem, updateItemState(activeItem);
	// // $: console.log({ $page });
	// // let activeIndex = -1;
	// // $: console.log({ activeIndex });
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
	// let value = '';
	// $: value, (sortedItems = sortedItems.filter((item) => item.title?.toLowerCase().includes(value)));
</script>

<div class="grid-cols-12 overflow-auto lg:grid">
	<div class="col-span-3">
		<ul>
			<li
				class="hidden h-10 flex-col justify-center border-b border-gray-100 px-4 dark:border-gray-700 md:flex md:px-6"
			>
				<a href="/rss?filter=all">All</a>
			</li>
			<li
				class="hidden h-10 flex-col justify-center border-b border-gray-100 px-4 dark:border-gray-700 md:flex md:px-6"
			>
				<a href="/rss/unread">Unread</a>
			</li>
			{#each feeds as feed (feed.id)}
				<li
					class="flex h-10 flex-col justify-center border-b border-gray-100 px-4 dark:border-gray-700 md:px-6"
				>
					<a href="/rss/{feed.id}">{feed.title}</a>
				</li>
			{/each}
		</ul>
	</div>
</div>
