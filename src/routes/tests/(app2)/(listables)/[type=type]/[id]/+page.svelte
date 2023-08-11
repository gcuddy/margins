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
	import { DefaultError, InfiniteData, createQuery, useQueryClient } from '@tanstack/svelte-query';
	import { entryQuery, useEntry } from './query';
	import { queryOptions } from '$lib/queries/utils';
	import type { Queries } from '../../../queries.server';
	import { queryFactory } from '$lib/queries/querykeys';
	import { numberOrString } from '$lib/utils/misc';
	import type { LibraryResponse } from '$lib/server/queries';
	import { getId } from '$lib/utils/entries';
	import MediaHeader from './MediaHeader.svelte';
	import Skeleton from '$components/ui/skeleton/Skeleton.svelte';
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
	// const query = createQuery(data.query);
	const queryClient = useQueryClient();
	const query = createQuery(
		derived(page, ($page) => {
			return {
				...queryFactory.entries.detail({
					id: numberOrString($page.params.id),
					type: data.type
				}),
				// placeholderData: () => {
				// 	console.time(`placeholderData`);
				// 	console.log({ queryClient });
				// 	const listData = queryClient.getQueriesData<InfiniteData<LibraryResponse>>({
				// 		queryKey: ['entries', 'list']
				// 	});

				// 	console.log({ listData });
				// 	const entry = listData
				// 		?.flatMap((list) => list[1])
				// 		?.flatMap((query) => query?.pages)
				// 		?.flatMap((page) => {
				// 			console.log({ page });
				// 			return page?.entries;
				// 		})
				// 		?.find((entry) => {
				// 			console.log({ entry, $page });
				// 			return getId(entry) === numberOrString($page.params.id);
				// 		}) as any;
				// 	console.timeEnd(`placeholderData`);
				// 	console.log({ entry });
				// 	return entry;
				// }
				// ...(!data.cache ? { refetchOnMount: false } : { initialData: data.cache })
			};
		})
	);
	$: console.log({ $query });

	afterNavigate(() => {
		// push to recents
		// save interaction
		if (!$query.data?.entry) return;
		if ($query.data.entry.title) {
			recents.add_entry($query.data.entry);
		}
		if ($query.data.entry.type !== 'article') return;
		mutation($page, 'saveInteraction', {
			entryId: $query.data.entry.id,
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
		{$query.data?.entry?.title} | {$query.data?.entry?.type}
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
		'grow transition-[width] duration-300',
		type !== 'pdf' && 'mt-[calc(var(--nav-height)+24px)] sm:px-6 px-4', // margin top is nav height + 24px (to account for header) (pdf handles this itself)
		$rightSidebar ? 'w-full md:w-[calc(100%-(var(--right-sidebar-width)))]' : 'w-full' // width is 100% - right sidebar width + 64px (to account for padding) if showing, otherwise just 100%

		// current_list && 'rounded-lg border bg-card text-card-foreground shadow-lg h-full  grow'
	)}
>
	{#if $query.isPlaceholderData || $query.isLoading}
		<Skeleton class="w-full h-[300px]" />
	{:else if $query.isSuccess}
		<!-- Placeholder Data: -->
		<!-- <pre>{JSON.stringify($query.data, null, 2)}</pre> -->
		<!-- <MediaHeader {...$query.data} /> -->
		{#if type === 'article'}
			<svelte:component this={data.component} data={$query.data}>
				{@html $query.data?.entry?.html}
			</svelte:component>
		{:else}
			<!-- if ['movie', 'book', 'podcast', 'tv', 'album', 'video'].includes(data.type) -->
			<svelte:component this={data.component} data={$query.data} />
		{/if}
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
