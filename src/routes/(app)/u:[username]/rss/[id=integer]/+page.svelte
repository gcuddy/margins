<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import KeyboardNav from '$lib/components/helpers/KeyboardNav/KeyboardNav.svelte';
	import KeyboardNavItem from '$lib/components/helpers/KeyboardNav/KeyboardNavItem.svelte';
	import dayjs from 'dayjs';
	import Muted from '$lib/components/atoms/Muted.svelte';
	export let data: PageData;
	$: ({ feed, items, currentList } = data);
	// $: currentList.set({
	// 	href: `/rss/${$page.params.id}`,
	// 	items,
	// 	title: feed?.title || 'Feed',
	// });
	// import FeedTitleMenu from '../../subscriptions/FeedTitleMenu.svelte';
	import { panes, sortedItems } from '../store';
</script>

<div class="flex-none snap-start " bind:this={$panes[1]}>
	{#if feed}
		<!-- <FeedTitleMenu {feed} /> -->
	{/if}
	<ul class="overflow-auto">
		<KeyboardNav {items}>
			{#each $sortedItems as item, index (item.id)}
				<li class="relative">
					<!-- unread indicator -->
					<KeyboardNavItem
						as="a"
						{index}
						class={({ active }) =>
							`flex flex-col justify-center ring-inset border-b border-gray-100 px-4 dark:border-gray-700 ${
								item.is_read
									? 'text-gray-500 dark:text-gray-400'
									: 'text-gray-900 dark:text-gray-100'
							} md:px-6 ` + (active ? 'bg-gray-200 dark:bg-gray-800 ring-1' : '')}
						href="/rss/{item.rssFeedId}/{item.uuid}"
						on:click={async () => {
							console.log($panes[2]);
							// await tick();
							// $panes[2]?.scrollIntoView({
							// 	behavior: 'smooth',
							// 	block: 'nearest',
							// });
						}}
					>
						<h2 class="line-clamp-2 {!item.is_read ? 'font-bold' : 'font-normal'} ">
							{item.title || '{no title}'}
						</h2>
						<p class="meta flex flex-col">
							<!-- {#if item.summary || item.contentSnippet}
							<p class="truncate">
								{item.summary || item.contentSnippet}
							</p>
						{/if} -->
							{#if item.pubDate}
								<Muted>
									<time datetime={dayjs(item.pubDate).toISOString()}
										>{dayjs(item.pubDate).format('MMM D, YYYY')}</time
									>
								</Muted>
							{/if}
							{#if item.author}
								<Muted>{item.author}</Muted>
							{/if}
						</p>
					</KeyboardNavItem>
				</li>
			{/each}
		</KeyboardNav>
	</ul>
</div>
<slot />
