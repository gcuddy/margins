<script lang="ts">
	import { Button } from '@margins/ui';
	import { findRSSFeeds, type RssSource } from '@margins/rss/finder';
	import { onMount } from 'svelte';
	import type { Parser } from '@margins/parser';
	import { getCurrentMetadata } from '../utils';
	import { state } from '../state';
	import { createQuery } from '@tanstack/svelte-query';
	import { getRPC } from './rpc-provider.svelte';

	export let parser: Parser;

	let hasFeed = false;
	let feeds: RssSource[] = [];
	let url: string | null = null;

	// TODO: cache this
	async function checkFeed() {
		getCurrentMetadata(async (data) => {
			const key = `feed:${data.url}`;
			url = data.url;
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

	const rpc = getRPC();

	$: subscriptionQuery = createQuery({
		enabled: !!feeds.length,
		queryFn: feeds.length
			? () =>
					rpc.query('subscription_fromUrl', {
						url: feeds.map((f) => f.url),
					})
			: undefined,
		queryKey: ['subscription', url],
	});

	$: console.log({ $subscriptionQuery });

	onMount(() => {
		checkFeed();
	});
</script>

<Button
	disabled={!hasFeed || !!$subscriptionQuery.data}
	on:click={() => {
		state.set({
			feeds,
			page: 'rss',
		});
	}}>Subscribe{$subscriptionQuery.data ? 'd' : ''}</Button
>
