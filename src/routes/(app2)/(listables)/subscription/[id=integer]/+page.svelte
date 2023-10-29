<script lang="ts">
	// import EntryList from '$lib/components/entries/EntryList.svelte';
	import { page } from '$app/stores';
	import List from '$components/entries/list.svelte';
	import LibraryHeader from '$components/library/library-header.svelte';
	import { Button } from '$components/ui/button';
	import * as Dialog from '$components/ui/dialog';
	import * as DropdownMenu from '$components/ui/dropdown-menu';
	import { Skeleton } from '$components/ui/skeleton';
	import EntryItemSkeleton from '$lib/components/entries/EntryItemSkeleton.svelte';
	import {
		mutate,
		qquery,
		type MutationInput,
		type QueryInput,
		type QueryOutput,
	} from '$lib/queries/query';
	import { getQueryContext, queryFactory } from '$lib/queries/querykeys';
	import { parseFilterFromSearchParams } from '$lib/schemas/library';
	import {
		createMutation,
		createQuery,
		useQueryClient,
		type InfiniteData,
	} from '@tanstack/svelte-query';
	import { CircleIcon, MoreHorizontalIcon } from 'lucide-svelte';
	import { CheckCircled, ClipboardCopy, Pencil1 } from 'radix-icons-svelte';
	import { derived } from 'svelte/store';

	import StatusIcon from '$components/entries/StatusIcon.svelte';
	import { initUpdateBookmarkMutation } from '$lib/queries/mutations';
	import { defaultStringifySearch } from '$lib/utils/search-params';
	import type { Snapshot } from './$types';
	import SubscriptionEdit from './subscription-edit.svelte';
	import { subscriptionOptions } from '$lib/queries/options/subscriptions';
	import { toast } from 'svelte-sonner';

	export let data;

	// $: query = data.query();

	const queryClient = useQueryClient();
	const query = createQuery(subscriptionOptions(+data.id));

	const markAllAsRead = createMutation({
		mutationFn: async () =>
			mutate('markAllAsRead', {
				feedId: +data.id,
			}),
		onSuccess: () => {
            toast.info('Marked all as read')
			queryClient.invalidateQueries({
				queryKey: ['subscriptions'],
			});
			queryClient.invalidateQueries({
				queryKey: ['entries', 'list'],
			});
		},
	});

	const saveInteractionMutation = createMutation({
		mutationFn: async (data: MutationInput<'saveInteraction'>) =>
			mutate('saveInteraction', data),
		onMutate(variables) {
			queryClient.setQueriesData<InfiniteData<QueryOutput<'get_library'>>>(
				{
					queryKey: ['entries', 'list'],
				},
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

	let isEditFeedModalOpen = false;

	$: console.log({ $query });
</script>

<svelte:head>
	<title>{$query.data?.feed.title} - Margins</title>
</svelte:head>

<LibraryHeader
	saveViewUrl="/views/explore/all{defaultStringifySearch(
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
		<DropdownMenu.Root positioning={{ placement: 'bottom-end' }}>
			<DropdownMenu.Trigger asChild let:builder>
				<Button variant="ghost" builders={[builder]} size="icon">
					<MoreHorizontalIcon class="h-4 w-4" />
				</Button>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content class="w-[200px]">
				<DropdownMenu.Item
					on:click={() => {
						isEditFeedModalOpen = true;
					}}><Pencil1 class="mr-2 h-4 w-4" />Edit</DropdownMenu.Item
				>
				{#if $query.data?.feed.feedUrl}
					{@const feedUrl = $query.data?.feed.feedUrl}
					<DropdownMenu.Item
						on:click={() => {
							navigator.clipboard.writeText(feedUrl);
                            toast.info('Copied feed url to clipboard')
						}}
					>
						<ClipboardCopy class="mr-2 h-4 w-4" />
						Copy feed url</DropdownMenu.Item
					>
				{/if}
				<DropdownMenu.Item on:click={() => $markAllAsRead.mutate()}
					><CheckCircled class="mr-2 h-4 w-4" />Mark all as read</DropdownMenu.Item
				>
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
					<StatusIcon status="Backlog" class="mr-2 h-3.5 w-3.5" />
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
					<CircleIcon class="mr-2 h-3.5 w-3.5" />
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

<Dialog.Root bind:open={isEditFeedModalOpen}>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Rename feed</Dialog.Title>
			<Dialog.Description>Enter a new name for the feed</Dialog.Description>
		</Dialog.Header>
		<SubscriptionEdit
			subscription={$query.data.feed}
			bind:open={isEditFeedModalOpen}
		/>
	</Dialog.Content>
</Dialog.Root>
