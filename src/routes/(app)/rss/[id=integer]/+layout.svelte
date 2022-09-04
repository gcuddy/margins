<script lang="ts">
	import type { FeedWithItems } from '$lib/types';
	import type { PageData } from './$types';
	import Item from '../RSSListItem.svelte';
	import { page } from '$app/stores';
	import KeyboardNav from '$lib/components/helpers/KeyboardNav/KeyboardNav.svelte';
	import KeyboardNavItem from '$lib/components/helpers/KeyboardNav/KeyboardNavItem.svelte';
	import dayjs from 'dayjs';
	import Muted from '$lib/components/atoms/Muted.svelte';
	export let data: PageData;
	$: ({ feed, items } = data);
	import Header from '$lib/components/layout/Header.svelte';
	import DefaultHeader from '$lib/components/layout/headers/DefaultHeader.svelte';
	import Button from '$lib/components/Button.svelte';
	import { modals } from '$lib/stores/modals';
	import UrlModal from '$lib/components/modals/URLModal.svelte';
	import Form from '$lib/components/Form.svelte';
	import { syncStore } from '$lib/stores/sync';
	import SmallPlus from '$lib/components/atoms/SmallPlus.svelte';
	import Icon from '$lib/components/helpers/Icon.svelte';
	import FeedTitleMenu from './FeedTitleMenu.svelte';
	import { post } from '$lib/utils';
	import { filteredItems } from '$lib/stores/filter';
</script>

<div class="col-span-3">
	<ul class="overflow-auto">
		<KeyboardNav {items}>
			{#each items as item, index (item.id)}
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
