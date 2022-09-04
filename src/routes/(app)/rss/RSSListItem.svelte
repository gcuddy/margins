<script lang="ts">
	import Header from '$lib/components/layout/Header.svelte';
	import type { RssFeedItem } from '@prisma/client';
	import dayjs from 'dayjs';
	export let item: RssFeedItem;
</script>

<article>
	<a
		data-sveltekit-prefetch
		class="flex h-20 flex-col justify-center border-b border-gray-100 px-4 dark:border-gray-700 md:px-6"
		href="/rss/{item.rssFeedId}/{item.uuid}"
		><h2 class="font-semibold">{item.title || '{no title}'}</h2>
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
	</a>
</article>
