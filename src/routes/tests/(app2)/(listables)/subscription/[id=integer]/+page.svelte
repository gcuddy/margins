<script lang="ts">
	// import EntryList from '$lib/components/entries/EntryList.svelte';
	import {
		createMutation,
		createQuery,
		type InfiniteData,
		useQueryClient,
	} from '@tanstack/svelte-query';
	import { CopyIcon } from 'lucide-svelte';
	import { derived, writable } from 'svelte/store';

	import { page } from '$app/stores';
	import EntryItem from '$components/entries/EntryItem.svelte';
	import List from '$components/entries/list.svelte';
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

	import type { Snapshot } from './$types';

	export let data;

	// $: query = data.query();

	const query = createQuery({
		queryFn: () =>
			qquery($page, 'subscription', {
				feedId: +data.id,
			}),
		queryKey: ['subscription', data.id],
	});

	const queryClient = useQueryClient();

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

	const entryQueryOpts = derived(
		page,
		($page) =>
			({
				dir: 'desc',
				filter: {
					feed: {
						eq: +data.id,
					},
				},
				library: false,
				sort: 'published',
				status: null,
			}) satisfies QueryInput<'get_library'>,
	);

	let active_id: number | undefined = undefined;

	export const snapshot: Snapshot = {
		capture: () => active_id,
		restore: (id: number) => (active_id = id),
	};
</script>

<Header>
	<span>{$query.data?.feed.title}</span>
	<DropdownMenu.Root>
		<DropdownMenu.Trigger asChild let:builder>
			<Button builders={[builder]}>Actions</Button>
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
</Header>

{#if $query.isLoading}
	<Skeleton class="h-10 w-1/2" />
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
	<H1>{$query.data.feed.title}</H1>
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
