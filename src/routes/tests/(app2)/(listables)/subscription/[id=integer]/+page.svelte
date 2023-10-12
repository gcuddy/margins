<script lang="ts">
	// import EntryList from '$lib/components/entries/EntryList.svelte';
	import {
		createMutation,
		createQuery,
		useQueryClient,
		type InfiniteData,
	} from '@tanstack/svelte-query';
	import { CircleIcon, CopyIcon, MoreHorizontalIcon } from 'lucide-svelte';
	import { derived } from 'svelte/store';

	import { page } from '$app/stores';
	import List from '$components/entries/list.svelte';
	import LibraryHeader from '$components/library/library-header.svelte';
	import { Button } from '$components/ui/button';
	import * as DropdownMenu from '$components/ui/dropdown-menu';
	import EntryItemSkeleton from '$lib/components/entries/EntryItemSkeleton.svelte';
	import Skeleton from '$lib/components/ui/skeleton/Skeleton.svelte';
	import {
		mutate,
		qquery,
		type MutationInput,
		type QueryInput,
		type QueryOutput,
	} from '$lib/queries/query';
	import { getQueryContext, queryFactory } from '$lib/queries/querykeys';
	import { parseFilterFromSearchParams } from '$lib/schemas/library';

	import StatusIcon from '$components/entries/StatusIcon.svelte';
	import { initUpdateBookmarkMutation } from '$lib/queries/mutations';
	import { defaultStringifySearch } from '$lib/utils/search-params';
	import type { Snapshot } from './$types';

	export let data;

	// $: query = data.query();

	const queryClient = useQueryClient();
	const utils = getQueryContext(queryClient);
	const query = createQuery(
		derived(page, ($page) => ({
			queryFn: () =>
				qquery($page, 'subscription', {
					feedId: +data.id,
				}),
			queryKey: ['subscription', data.id],
			placeholderData: () => {
				const subscriptions = utils.getData(queryFactory.subscriptions.all());
				if (subscriptions) {
					const subscription = subscriptions.find((d) => d.feedId === +data.id);
					console.log({ subscription });
					if (subscription) {
						return {
							feed: subscription,
						};
					}
					// return subscription;
				}
				return undefined;
			},
		})),
	);

	const saveInteractionMutation = createMutation({
		mutationFn: async (data: MutationInput<'saveInteraction'>) =>
			mutate('saveInteraction', data),
		onMutate(variables) {
			// TODO: try to set query data
			queryClient.setQueriesData<InfiniteData<QueryOutput<'get_library'>>>(
				{
					queryKey: ['entries', 'list'],
				},
				//@ts-expect-error - interactionData uses booleans instead of numbers
				(old) => {
					if (!old) {
						return old;
					}
					const { entryId, id, ...interactionData } = variables;

					const newData = {
						...old,
						pages: old.pages.map((page) => {
							return {
								...page,
								entries: page.entries.map((entry) => {
									if (
										Array.isArray(variables.entryId)
											? variables.entryId.includes(entry.id)
											: entry.id === variables.entryId
									) {
										return {
											...entry,
											...interactionData,
										};
									}
									return entry;
								}),
							};
						}),
					};
					return newData;
				},
			);
		},
	});

    const updateBookmarkMutation = initUpdateBookmarkMutation();

	const entryQueryOpts = derived(page, ($page) => {
		const filterData = parseFilterFromSearchParams($page.url.search);
		// const { feed, ...rest } = filterData;
		return {
			dir: 'desc',
			filter: {
				feed: {
					in: [+data.id],
				},
				...filterData,
			},
			library: false,
			sort: 'published',
			status: null,
		} satisfies QueryInput<'get_library'>;
	});

	let active_id: number | undefined = undefined;

	export const snapshot: Snapshot = {
		capture: () => active_id,
		restore: (id: number) => (active_id = id),
	};
</script>

<LibraryHeader
	saveViewUrl="/tests/views/explore/all{defaultStringifySearch(
		$entryQueryOpts.filter,
	)}"
>
	<span slot="title">
		{#if $query.data}
			{$query.data?.feed.title}
		{:else}
			<Skeleton class="h-10 w-36" />
		{/if}
	</span>
	<svelte:fragment slot="buttons">
		<DropdownMenu.Root>
			<DropdownMenu.Trigger asChild let:builder>
				<Button variant="ghost" builders={[builder]} size="icon">
					<MoreHorizontalIcon class="w-4 h-4" />
				</Button>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content>
				<DropdownMenu.Item>Rename</DropdownMenu.Item>
				{#if $query.data?.feed.feedUrl}
					{@const feedUrl = $query.data?.feed.feedUrl}
					<DropdownMenu.Item
						on:click={() => {
							navigator.clipboard.writeText(feedUrl);
						}}
					>
						<CopyIcon class="w-4 h-4 mr-2" />
						Copy feed url</DropdownMenu.Item
					>
				{/if}
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</svelte:fragment>
</LibraryHeader>

{#if $query.isLoading}
	<div class="flex flex-col">
		<EntryItemSkeleton />
		<EntryItemSkeleton />
		<EntryItemSkeleton />
		<EntryItemSkeleton />
		<EntryItemSkeleton />
		<EntryItemSkeleton />
		<EntryItemSkeleton />
	</div>
{:else if $query.isSuccess}
	<!-- <H1>{$query.data.feed.title}</H1> -->
	<List opts={entryQueryOpts}>
		<svelte:fragment slot="actions" let:checkedEntries let:clear>
			{#if !checkedEntries.every((e) => e.bookmarked_at)}
				<Button
					variant="outline"
					size="sm"
					on:click={() => {
						$updateBookmarkMutation.mutate({
                            data: {
                                bookmarked_at: new Date(),
                                status: 'Backlog',
                            },
							entryId: checkedEntries.map((e) => e.id),
						});
						clear();
					}}
				>
					<StatusIcon status="Backlog" class="w-3.5 h-3.5 mr-2" />
					Save to backlog</Button
				>
			{/if}
			{#if checkedEntries.some((e) => !e.seen)}
				<Button
					variant="outline"
					size="sm"
					on:click={() => {
						$saveInteractionMutation.mutate({
							entryId: checkedEntries.map((e) => e.id),
							seen: true,
						});
						clear();
					}}
				>
					<CircleIcon class="w-3.5 h-3.5 mr-2" />
					Mark as seen</Button
				>
			{/if}
		</svelte:fragment>
	</List>
	<!-- {#each $query.data.entries as entry}
			<li>{entry.title} - {entry.uri} - {entry.podcastIndexId} - {entry.updatedAt}</li>
			<EntryItem {entry} />
		{/each} -->
	<!-- {JSON.stringify($query.data)} -->
	<!-- <EntryList bind:active_id bulkForm={data.bulkForm} entries={$query.data.entries} /> -->
{/if}
