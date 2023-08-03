<script lang="ts">
	import { getCurrentListContext } from '$lib/stores/currentList';
	import type { PageData } from './$types';

	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import {
		QueryInput,
		QueryOutput,
		TypedQueryKey,
		getArrayQueryKey,
		mutation,
		qquery
	} from '$lib/queries/query';
	import { recents } from '$lib/stores/recents';
	import { cn } from '$lib/utils/tailwind';
	import { update_entry } from '$lib/state/entries';
	import { getContext, onMount, setContext } from 'svelte';
	import { get_module } from './module';
	import { derived, writable } from 'svelte/store';
	import { DefaultError, createQuery } from '@tanstack/svelte-query';
	import { entryQuery, useEntry } from './query';
	import { queryOptions } from '$lib/queries/utils';
	import type { Queries } from '../../../queries.server';
	import { queryFactory } from '$lib/queries/querykeys';
	// import Mentions from './Mentions.svelte';

	export let data: PageData;

	$: ({ type } = data);
	const currentList = getCurrentListContext();
	$: currentIndex = $currentList.entries.findIndex((e) => e.id === data.entry?.id);
	$: nextId = $currentList.entries[currentIndex + 1]?.id;
	$: prevId = $currentList.entries[currentIndex - 1]?.id;

	$: ({ hasMore } = currentList);

	// desired api: queryOpts("fn", { id: $page.params.id, type: data.type })

	function createQueryOptions<TFn extends keyof Queries>(fn: TFn, input: QueryInput<TFn>) {
		return queryOptions<QueryOutput<TFn>, DefaultError, QueryOutput<TFn>, TypedQueryKey<TFn>>({
			queryKey: getArrayQueryKey(fn, input),
			queryFn: ({ queryKey }) => qquery($page, queryKey[0][0], queryKey[1].input)
		});
	}

	// const query = useEntry({
	// 	id: +$page.params.id,
	// 	type: data.type
	// });
	$: console.log({ $query });
	const query = createQuery(
		derived(page, ($page) => {
			return queryFactory.entries.detail({
				id: Number.isInteger(+$page.params.id) ? +$page.params.id : $page.params.id,
				type: data.type
			});
		})
	);

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
		if (!$query.data?.entry) return;
		update_entry($query.data.entry.id, $query.data.entry);
	}

	// todo
	let current_list = true;

	const rightSidebar = getContext('rightSidebar') as Writable<boolean>;

	onMount(async () => {
		// try to get component if it doesn't exist, for example we're mounting this component elsewhere
		if (!data.component) {
			const module = await get_module(data.type);
			data.component = module?.default;
		}
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

<div
	class={cn(
		'grow',
		type !== 'pdf' && 'mt-[calc(var(--nav-height)+24px)]', // margin top is nav height + 24px (to account for header) (pdf handles this itself)
		$rightSidebar ? 'w-[calc(100%-(var(--right-sidebar-width)))]' : 'w-full' // width is 100% - right sidebar width + 64px (to account for padding) if showing, otherwise just 100%
		// current_list && 'rounded-lg border bg-card text-card-foreground shadow-lg h-full  grow'
	)}
>
	{#if type === 'article'}
		<svelte:component this={data.component} data={{ ...data, ...$query.data }}>
			{@html $query.data?.entry?.html}
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
