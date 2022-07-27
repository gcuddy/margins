<script lang="ts">
	import type { RssFeedItem } from '@prisma/client';
	export let item: RssFeedItem;
	console.log({ item });
</script>

<article>
	<header>
		<h2><a href="/rss/{item.rssFeedUUID}/{item.uuid}">{item.title}</a></h2>
		<p class="meta">
			<time datetime={item.pubDate?.toISOString()}>{item.pubDate}</time>
			{#if item.author}
				<span> by {item.author}</span>
			{/if}
		</p>
	</header>
</article>
