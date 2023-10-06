<script lang="ts">
	// import EntryList from '$lib/components/entries/EntryList.svelte';
	import {
		createMutation,
		createQuery,
		type InfiniteData,
		useQueryClient,
	} from '@tanstack/svelte-query';
	import { CopyIcon, MoreHorizontalIcon } from 'lucide-svelte';
	import { derived, writable } from 'svelte/store';

	import { page } from '$app/stores';
	import EntryItem from '$components/entries/EntryItem.svelte';
	import List from '$components/entries/list.svelte';
	import LibraryHeader from '$components/library/library-header.svelte';
	import { Button } from '$components/ui/button';
	import * as DropdownMenu from '$components/ui/dropdown-menu';
	import Header from '$components/ui/Header.svelte';
	import EntryItemSkeleton from '$lib/components/entries/EntryItemSkeleton.svelte';
	import Skeleton from '$lib/components/ui/skeleton/Skeleton.svelte';
	import { H1 } from '$lib/components/ui/typography';
	import {
		mutate,
		type MutationInput,
		qquery,
		type QueryInput,
		type QueryOutput,
	} from '$lib/queries/query';
	import { parseFilterFromSearchParams } from '$lib/schemas/library';
	import { queryFactory, getQueryContext } from '$lib/queries/querykeys';

	import type { Snapshot } from './$types';
	import { defaultStringifySearch } from '$lib/utils/search-params';

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
                            feed: subscription
                        }
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

	const entryQueryOpts = derived(page, ($page) => {
		const filterData = parseFilterFromSearchParams($page.url.search);
        // const { feed, ...rest } = filterData;
		return {
			dir: 'desc',
			filter: {
				feed: {
					eq: +data.id,
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

<LibraryHeader saveViewUrl="/tests/views/explore/all{defaultStringifySearch($entryQueryOpts.filter)}">
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
			{#if checkedEntries.some((e) => !e.seen)}
				<Button
					on:click={() => {
						$saveInteractionMutation.mutate({
							entryId: checkedEntries.map((e) => e.id),
							seen: true,
						});
						clear();
					}}>Mark as seen</Button
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
