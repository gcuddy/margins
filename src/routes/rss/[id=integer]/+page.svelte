<script lang="ts">
	import type { FeedWithItems } from '$lib/types';
	import type { PageData } from './$types';
	import Item from '../RSSListItem.svelte';
	import { currentFeedList } from '../+page.svelte';
	import { page } from '$app/stores';
	import KeyboardNav from '$lib/components/helpers/KeyboardNav/KeyboardNav.svelte';
	import KeyboardNavItem from '$lib/components/helpers/KeyboardNav/KeyboardNavItem.svelte';
	import dayjs from 'dayjs';
	export let data: PageData;
	$: ({ feed } = data);
	$: currentFeedList.set({
		items: feed.items,
		title: feed.title,
		href: '/rss/' + feed.id
	});
</script>

<KeyboardNav items={feed.items}>
	<ul class="overflow-auto">
		{#each feed.items as item, index (item.id)}
			<li>
				<KeyboardNavItem
					as="a"
					{index}
					class={({ active }) =>
						'flex h-20 flex-col justify-center border-b border-gray-100 px-4 dark:border-gray-700 md:px-6 ' +
						(active ? 'bg-gray-200' : '')}
					href="/rss/{item.rssFeedId}/{item.id}"
				>
					<h2 class="font-semibold">{item.title || '{no title}'}</h2>
					<p class="meta">
						{#if item.pubDate}
							<time datetime={dayjs(item.pubDate).toISOString()}
								>{dayjs(item.pubDate).format('MMM D, YYYY')}</time
							>
						{/if}
						{#if item.author}
							<span> by {item.author}</span>
						{/if}
					</p>
				</KeyboardNavItem>
			</li>
		{/each}
	</ul>
</KeyboardNav>
