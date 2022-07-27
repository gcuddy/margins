<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Form from '$lib/components/Form.svelte';
	import Header from '$lib/components/layout/Header.svelte';
	import DefaultHeader from '$lib/components/layout/headers/DefaultHeader.svelte';
	import UrlModal from '$lib/components/modals/URLModal.svelte';
	import { modals } from '$lib/stores/modals';
	import type { FeedWithItems } from '$lib/types';
	import type { RssFeed } from '@prisma/client';
	import RssFeedBar from './_RSSFeedBar.svelte';
	import { feedStore, subscribedFeedIds } from './_stores';
	export let feeds: RssFeed[] = [];
	feedStore.set(feeds);
	console.log({ feeds });
	async function refreshFeeds() {
		// this essentially does what /rss/refresh form does
		await fetch('/rss/refresh');
	}
	// RSS Fetcher needs to be a background job
</script>

<!-- 
<section class="">
	<div class="col-span-1">
	</div>
	<div class="col-span-2">
		<h1 class="text-2xl">RSS</h1>
		<form action="/rss/add">
			<Button type="submit">Add feed</Button>
		</form>
		<Form action="/rss/refresh">
			<input type="hidden" name="feed_ids" value={$subscribedFeedIds.join(',')} />
			<Button type="submit">Refresh feeds</Button>
		</Form>
	</div>
</section> -->

{#each feeds as feed}
	<a href="/rss/{feed.id}">{feed.title}</a>
{/each}
