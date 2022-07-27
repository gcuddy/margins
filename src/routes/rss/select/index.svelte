<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import type { CreateFeedWithItems } from '$lib/types';
	import { stringify } from 'postcss';
	import type Parser from 'rss-parser';
	import type { FeedUrl } from './_rss-parser';
	export let feeds: FeedUrl[] | CreateFeedWithItems | CreateFeedWithItems[] = [];
	if (!Array.isArray(feeds)) feeds = [feeds];
	// TODO: get this type working properly and go from here....
	console.log({ feeds });
	// todo: fix these types
</script>

<div class="container mx-auto px-4">
	<!-- if it's an array, offer which feed to select, otherwise, go right to categorizatoini -->
	{#if feeds.length}
		<form action="/rss" method="post">
			{#each feeds as feed, index (index)}
				<img src={feed.image} />
				<label>
					Feed title for <code>{feed.feedUrl}</code>
					<input type="text" value={feed.title} name="feed-title" />
					<!-- <img src={feed.image.url} loading="lazy" /> -->
					{#if feeds.length > 1}
						<input
							type="checkbox"
							value={feed.feedUrl}
							name="feed-selected"
							checked={index === 0}
						/>
					{:else}
						<input type="hidden" name="feed-selected" value={feed.feedUrl} />
					{/if}
					<input type="hidden" name="feed" value={JSON.stringify(feed)} />
				</label>
			{/each}

			<div>
				<Button type="submit">Subscribe</Button>
			</div>
		</form>
	{:else}
		No feeds found.
	{/if}
</div>
