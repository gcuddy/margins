<script lang="ts">
	import { getCurrentListContext } from '$lib/stores/currentList';
	import type { PageData } from './$types';

	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import { mutation } from '$lib/queries/query';
	import { recents } from '$lib/stores/recents';
	import { cn } from '$lib/utils/tailwind';
	import { update_entry } from '$lib/state/entries';
	import { onMount, setContext } from 'svelte';
	import { get_module } from './module';
	import { writable } from 'svelte/store';
	// import Mentions from './Mentions.svelte';

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

	sync();

    setContext('pdf', writable(null));

	function sync() {
		if (!data.entry) return;
		update_entry(data.entry.id, data.entry);
	}

	// todo
	let current_list = true;


	onMount(async () => {
		// try to get component if it doesn't exist, for example we're mounting this component elsewhere
		if (!data.component) {
			const module = await get_module(data.type)
			data.component = module?.default
		}
	})
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

<div
	class={cn(
		'px-4 grow'
		// current_list && 'rounded-lg border bg-card text-card-foreground shadow-lg h-full  grow'
	)}
>
	{#if type === 'article'}
		<svelte:component this={data.component} {data}>
			{@html data.entry?.html}
		</svelte:component>
	{:else}
		<!-- if ['movie', 'book', 'podcast', 'tv', 'album', 'video'].includes(data.type) -->
		<svelte:component this={data.component} {data} />
	{/if}
</div>

{#if data.entry && data.entry.title}
	<!-- <Mentions
		entry={{
			id: data.entry.id,
			title: data.entry.title
		}}
	/> -->
{/if}

<style lang="postcss">
</style>
