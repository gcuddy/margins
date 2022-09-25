<script lang="ts">
	import Muted from '$lib/components/atoms/Muted.svelte';
	import type { RssItemWithFeed } from '$lib/types/rss';
	import dayjs from 'dayjs';
	export let item: RssItemWithFeed;
	$: hostname = item.feed.link ? new URL(item.feed.link).hostname : '';
</script>

<article>
	<a
		class="flex h-20 max-w-prose flex-col justify-between overflow-hidden px-4 py-2 text-sm"
		href="/rss/{item.rssFeedId}/{item.uuid}"
	>
		<div class="flex flex-col">
			<div class="flex space-x-4 ">
				<img
					class="h-5 w-5 shrink-0 rounded-lg"
					src="https://icon.horse/icon/{hostname}"
					alt="{hostname} icon"
				/>
				<span class="grow truncate text-base font-bold">{item.title || '{no title}'}</span>
			</div>
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
