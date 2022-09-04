<script lang="ts">
	import Muted from '$lib/components/atoms/Muted.svelte';
	import type { RssItemWithFeed } from '$lib/types/rss';
	import dayjs from 'dayjs';
	export let item: RssItemWithFeed;
</script>

<article>
	<a
		data-sveltekit-prefetch=""
		class="flex h-20 flex-col justify-between overflow-hidden p-1 text-sm"
		href="/rss/{item.rssFeedId}/{item.uuid}"
	>
		<div class="line-clamp-3">
			<span class="font-semibold"
				><a href="/rss/{item.feed.id}/{item.uuid}">{item.title || '{no title}'}</a></span
			>
			{#if item.contentSnippet}
				<span class="truncate">{item.contentSnippet}</span>
			{/if}
		</div>
		<div class="flex justify-between">
			<Muted>{item.feed.title}</Muted>
			{#if item.pubDate}
				<Muted
					><span class="font-medium"
						><time datetime={dayjs(item.pubDate).toISOString()}
							>{dayjs(item.pubDate).format('MMM D, YYYY')}</time
						></span
					></Muted
				>
			{/if}
		</div>
	</a>
</article>
