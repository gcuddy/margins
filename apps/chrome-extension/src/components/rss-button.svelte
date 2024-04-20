<script lang="ts">
	import { Button } from '@margins/ui';
	import { findRSSFeeds } from '@margins/rss/finder';
	import { onMount } from 'svelte';
	import type { Parser } from '@margins/parser';
	import { getCurrentMetadata } from '../utils';

	export let parser: Parser;

	let hasFeed = false;

	async function checkFeed() {
		getCurrentMetadata(async (data) => {
			const feeds = await findRSSFeeds(parser, data);
			console.log({ feeds });
			hasFeed = feeds.length > 0;
		});
	}

	onMount(() => {
		checkFeed();
	});
</script>

{#if hasFeed}
	<Button>Subscribe</Button>
{/if}
