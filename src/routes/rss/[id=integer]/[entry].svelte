<script lang="ts">
	import type { RssFeedItem } from '@prisma/client';

	export let item: RssFeedItem;
	console.log({ item });
</script>

<article>
	<header>
		<h2><a href={item.link}>{item.title}</a></h2>
		<p class="meta">
			<time datetime={item.pubDate}>{item.pubDate}</time>
			{#if item.author}
				<span> by {item.author}</span>
			{/if}
		</p>
	</header>
	<div class="prose">
		{@html item.content || item.contentSnippet || item.summary}
	</div>
</article>
