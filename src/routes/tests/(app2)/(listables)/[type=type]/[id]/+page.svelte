<script lang="ts">
	import { getCurrentListContext } from '$lib/stores/currentList';
	import type { PageData } from './$types';

	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import { mutation } from '$lib/queries/query';
	import { recents } from '$lib/stores/recents';
	import Mentions from './Mentions.svelte';

	export let data: PageData;
	$: ({ type } = data);
	const currentList = getCurrentListContext();
	$: currentIndex = $currentList.entries.findIndex((e) => e.id === data.entry?.id);
	$: nextId = $currentList.entries[currentIndex + 1]?.id;
	$: prevId = $currentList.entries[currentIndex - 1]?.id;

	$: ({ hasMore } = currentList);

	afterNavigate(() => {
		// push to recents
		// save interaction
		if (!data.entry) return;
		if (data.entry.title) {
			recents.add_entry(data.entry);
		}
		if (data.entry.type !== 'article') return;
		mutation($page, 'saveInteraction', {
			entryId: data.entry.id,
			last_viewed: new Date(),
			is_read: true
		});
	});
</script>

<svelte:head>
	<title>
		{data.entry?.title} | {data.entry?.type}
	</title>
</svelte:head>

<!-- lil arrows -->
{#if prevId || nextId}
	<div class="fixed right-4 top-4 flex flex-col">
		{#if prevId}
			<a href="/tests/entry/{prevId}">prev</a>
		{/if}

		{#if nextId}
			<a href="/tests/entry/{nextId}">next</a>
		{/if}
		{#if $hasMore && !nextId}
			<button on:click={currentList.fetch}> fetch more </button>
			{#if $currentList.loading}
				<span>loading...</span>
			{/if}
		{/if}
	</div>
{/if}

{#if type === 'article'}
	<svelte:component this={data.component} {data}>
		{@html data.entry?.html}
	</svelte:component>
{:else}
<!-- if ['movie', 'book', 'podcast', 'tv', 'album', 'video'].includes(data.type) -->
	<svelte:component this={data.component} {data} />
{/if}

{#if data.entry && data.entry.title}
	<Mentions
		entry={{
			id: data.entry.id,
			title: data.entry.title
		}}
	/>
{/if}

<style lang="postcss">
</style>
