<script lang="ts">
	import { onMount } from 'svelte';

	import Tweet from '$components/Tweet.svelte';
	import * as Card from '$components/ui/card';
	import { render_html } from '$components/ui/editor/utils';
	import { make_link } from '$lib/utils/entries';
	import { cn } from '$lib/utils/tailwind';

	import type { PageData } from './$types';
	export let item: PageData['collection']['items'][number];
    export let shouldTransition = false;

	// TODO: GET AVERAGE COLOR...

	export let width: 'default' | 'wide' = 'default';

    let loaded = false;

    onMount(() => {
        loaded = true;
    })
</script>

<Card.Root
	class={cn(
		'w-52 h-72 overflow-auto flex flex-col p-4 gap-4 relative group max-w-full transition-[width]',
		width === 'wide' && 'w-[432px] lg:w-[432px] md:w-[653px] flex-row p-0',
	)}
>
	{#if item.entry?.type === 'tweet'}
		{@const id = item.entry?.uri?.split('/').pop()}
		{#if id}
			<Tweet {id} />
		{/if}
	{:else if item.entry}
		{#if width === 'default'}
			<div
				class="flex shrink-0 min-w-0 w-full order-2 flex-col justify-between gap-1"
			>
				<a
					href={make_link(item.entry)}
					class={cn(
						'text-base font-bold tracking-tight line-clamp-1',
						item.entry.type === 'article' && 'line-clamp-2',
					)}
				>
					{item.entry?.title}
				</a>
				<span class="text-muted-foreground text-sm line-clamp-2">
					{item.entry?.author}
				</span>
				<span class="text-muted-foreground text-xs">
					{item.entry?.type}
				</span>
			</div>
			<div
				class="shrink relative overflow-auto object-cover order-1 flex flex-col items-center justify-center rounded"
			>
				<img
					class={cn(
						'w-40 h-40 object-cover rounded-[inherit] z-10',
						// item.entry?.type === 'movie' && 'w-40 h-48',
						// item.entry?.type === 'article' && 'w-40 h-32',
					)}
					alt=""
					src={item.entry?.image}
				/>
			</div>
		{:else if width === 'wide'}
			<div class="flex shrink order-2 flex-col gap-1 py-4 pr-2">
				<span class="text-muted-foreground text-xs">
					{item.entry?.type}
				</span>
				<a
					href={make_link(item.entry)}
					class={cn('text-lg font-bold tracking-tight line-clamp-3')}
				>
					{item.entry?.title}
				</a>
				<span class="text-muted-foreground text-sm line-clamp-2">
					{item.entry?.author}
				</span>
			</div>
			<img
				class={cn(
					' w-48 h-auto object-cover',
					// item.entry?.type === 'movie' && 'w-40 h-48',
					// item.entry?.type === 'article' && 'w-40 h-32',
				)}
				alt=""
				src={item.entry?.image}
			/>
		{/if}
	{:else if item.annotation}
		<div class="overflow-hidden rounded-md text-sm">
			{item.annotation.body}
		</div>
		<a
			href="/tests/note/{item.annotation.id}"
			class="text-sm font-medium order-2"
		>
			{item.annotation.title}
		</a>
		<div class="overflow-auto order-1">
			{#if item.annotation.contentData}
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				{@html render_html(item.annotation.contentData)}
			{/if}
		</div>
	{/if}
	<slot />
</Card.Root>
