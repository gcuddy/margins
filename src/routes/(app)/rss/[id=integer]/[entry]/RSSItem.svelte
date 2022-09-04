<script lang="ts">
	import { disableGlobalKeyboardShortcuts } from '$lib/stores/keyboard';
	import { notifications } from '$lib/stores/notifications';
	import type { RssItemWithFeed } from '$lib/types/rss';
	import type { Load } from '@sveltejs/kit';
	import dayjs from 'dayjs';
	import { onMount } from 'svelte';
	import H1 from '$lib/components/atoms/H1.svelte';
	import Muted from '$lib/components/atoms/Muted.svelte';
	import SmallPlus from '$lib/components/atoms/SmallPlus.svelte';
	import ProseWrapper from '$lib/components/ProseWrapper.svelte';

	export let item: RssItemWithFeed;
	$: console.log({ item });

	let container: HTMLElement;
	export let scrollIntoView = true;
	export let linkBack = false;
	export let maxWidth = true;
	$: item.link, container && scrollIntoView && container?.scrollIntoView();

	/**read only*/
	export let el: HTMLElement | undefined = undefined;

	// function markAsRead() {
	// 	item.is_read = true;
	// 	fetch(`/api/mark_item_as_read`, {
	// 		method: 'POST',
	// 		headers: {
	// 			'Content-Type': 'application/json'
	// 		},
	// 		body: JSON.stringify({
	// 			id: item.id
	// 		})
	// 	});
	// }
	// $: item.link, !item.is_read && markAsRead();

	// onMount(async () => {
	// 	if (item.is_read) return;
	// 	const res = await fetch(`/api/mark_item_as_read`, {
	// 		method: 'POST',
	// 		headers: {
	// 			'Content-Type': 'application/json'
	// 		},
	// 		body: JSON.stringify({
	// 			id: item.id
	// 		})
	// 	});
	// 	if (res.status === 200) {
	// 		item.is_read = true;
	// 	}
	// });

	let pending_add_item = false;
	let item_in_library = false;
</script>

<svelte:window
	on:keydown={(event) => {
		if ($disableGlobalKeyboardShortcuts) return;
		if (event.key === ' ') {
			console.log('space');
			container.focus();
		}
	}}
/>

<!-- todo: create component that onmount marks item as read -->
<article
	bind:this={container}
	class="flex flex-grow flex-col overflow-y-auto   bg-gray-50 dark:bg-gray-900"
>
	<!-- TODO: could this somehow hide on scroll? -->
	<div class={maxWidth && 'mx-auto max-w-prose'}>
		<div
			class="flex  flex-row items-center justify-between border-b border-gray-200 p-3 text-sm dark:border-gray-700"
		>
			<slot name="header">
				<div class="flex w-full justify-between">
					<a data-sveltekit-prefetch class="flex items-center" href="/rss/{item.feed.id}"
						><SmallPlus class="text-gray-500 dark:text-gray-400">{item?.feed.title}</SmallPlus></a
					>
					<div>
						<img
							alt=""
							class="h-8 w-8 rounded-lg object-cover"
							src={item.feed.imageUrl || `https://icon.horse/icon/?uri=${item.feed.link}`}
						/>
					</div>
				</div>
			</slot>
		</div>
		<div class=" p-4">
			<ProseWrapper bind:el breakpoints={true} font="sans" class="max-w-prose space-y-6">
				<header class="not-prose font-sans">
					<a href={item.link} target="_blank"
						><H1 lg={false}>
							{item.title}
						</H1>
					</a>
					{#if item.pubDate || item.author}
						<p class="meta text-base text-gray-500">
							<a href={item.link} class="flex space-x-3" target="_blank">
								{#if item.pubDate}
									<Muted>
										<time datetime={dayjs(item.pubDate).toISOString()}
											>{dayjs(item.pubDate).format('MMM D, YYYY')}</time
										></Muted
									>
								{/if}
								{#if item.author}
									<Muted><span>{item.author}</span></Muted>
								{/if}
							</a>
						</p>
					{/if}
				</header>
				<div class="w-full max-w-prose">
					{@html item.content || item.contentSnippet || item.summary || '[No content]'}
				</div>
			</ProseWrapper>
		</div>
	</div>
</article>

<style lang="postcss">
	article {
		scrollbar-gutter: stable;
	}
	/* article::-webkit-scrollbar {
		width: 8px;
		height: 8px;
		background-color: transparent;
	}

	article::-webkit-scrollbar-thumb {
		border-radius: 12px;
		@apply bg-gray-500;
	}
	article::-webkit-scrollbar-track {
		padding: 2px;
		background-color: transparent;
	} */

	article :global(iframe) {
		width: 100%;
	}
</style>
