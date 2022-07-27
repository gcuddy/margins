<script lang="ts">
	import type { RssFeedItem } from '@prisma/client';
	import dayjs from 'dayjs';
	export let item: RssFeedItem;
	console.log({ item });
</script>

<article>
	<a sveltekit:prefetch class="flex space-x-3" href="/rss/{item.rssFeedId}/{item.id}"
		><h2>{item.title}</h2>
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
