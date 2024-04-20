<script lang="ts">
	import { Button } from '@margins/ui';
	import { findRSSFeeds, type RssSource } from '@margins/rss/finder';
	import { onMount } from 'svelte';
	import type { Parser } from '@margins/parser';
	import { getCurrentMetadata } from '../utils';
	import { state } from '../state';

	export let parser: Parser;

	let hasFeed = false;
	let feeds: RssSource[] = [];

	// TODO: cache this
	async function checkFeed() {
		getCurrentMetadata(async (data) => {
			const key = `feed:${data.url}`;
			const { [key]: cached } = await chrome.storage.session.get(key);
			if (cached) {
				feeds = cached;
				hasFeed = feeds.length > 0;
				return;
			} else {
				const _feeds = await findRSSFeeds(parser, data);
				feeds = _feeds;
				hasFeed = feeds.length > 0;
				chrome.storage.session.set({ [key]: feeds });
			}
		});
	}

	onMount(() => {
		checkFeed();
	});
</script>

<Button
	disabled={!hasFeed}
	on:click={() => {
		state.set({
			feeds,
			page: 'rss',
		});
	}}>Subscribe</Button
>
