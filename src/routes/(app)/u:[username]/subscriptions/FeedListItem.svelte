<script lang="ts">
	import { page } from '$app/stores';
	import Muted from '$lib/components/atoms/Muted.svelte';
	import type { EntryWithBookmark } from '$lib/entry.server';
	import type { RssItemWithFeed } from '$lib/types/rss';
	import { getHostname } from '$lib/utils';
	import type { Entry } from '@prisma/client';
	import dayjs from 'dayjs';
	export let item: EntryWithBookmark;
	export let feed: {
		feedUrl: string;
		title: string | null;
	};
	const getHostName = (str: string) => {
		try {
			new URL(str).hostname;
		} catch {
			return str;
		}
	};
	$: hostname = getHostname(feed.feedUrl);

	$: href = `/u:${$page.data.user?.username}/entry/${item.id}`;
	$: active = $page.url.pathname === href;
	let el: HTMLElement;
	$: active && el && el.scrollIntoView({ block: 'nearest' });
	$: unread = !item.interactions[0]?.is_read;
</script>

<article bind:this={el}>
	<a
		class="flex h-20 max-w-prose flex-col justify-between overflow-hidden px-4 py-2 text-sm {active
			? 'bg-blue-200'
			: ''}"
		{href}
	>
		<div class="relative flex flex-col">
			{#if unread}<div class="absolute top-0 left-0 h-4 w-4 rounded-full bg-blue-500" />{/if}
			<div class="flex space-x-4 ">
				<img
					class="h-5 w-5 shrink-0 rounded-lg"
					src="https://icon.horse/icon/{hostname}"
					alt="{hostname} icon"
				/>
				<span class="grow truncate text-base font-bold">{item.title || '{no title}'}</span>
			</div>
			{#if item.summary}
				<span class="truncate">{item.summary}</span>
			{/if}
		</div>
		<div class="flex justify-between">
			<Muted>{feed.title}</Muted>
			{#if item.published}
				<Muted
					><span class="font-medium"
						><time datetime={dayjs(item.published).toISOString()}
							>{dayjs(item.published).format('MMM D, YYYY')}</time
						></span
					></Muted
				>
			{/if}
		</div>
	</a>
</article>
