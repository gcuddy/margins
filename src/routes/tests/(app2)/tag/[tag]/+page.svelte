<script lang="ts">
	import EntryList from '$lib/components/entries/EntryList.svelte';
	import { EntryItemSkeleton } from '$lib/components/entry-item';
	import { H1 } from '$lib/components/ui/typography';
	import { TagIcon } from 'lucide-svelte';
	import type { Snapshot } from './$types.js';
	import PinButton from '$lib/components/PinButton.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { createInfiniteQuery, useQueryClient } from '@tanstack/svelte-query';
	import { queryKeys } from '$lib/queries/keys';
	import { query } from '$lib/queries/query';

	export let data;
	let tagQuery = createInfiniteQuery({
		queryKey: ['tags', data.tag, 'entries'],
		queryFn: (ctx) => {
			return query({}, 'entries_by_tag', {
				name: data.tag.name,
				cursor: ctx.pageParam
			})
		},
		defaultPageParam: undefined,
		getNextPageParam: (lastPage) => lastPage?.nextCursor
	});
	$: tagQuery = tagQuery;
	let entrylist: EntryList;
	export const snapshot: Snapshot = {
		capture: () => entrylist?.capture(),
		restore: (snapshot) => entrylist?.restore(snapshot)
	};
	const queryClient = useQueryClient();

	// $: query = createInfiniteQuery(data.query_options)
	//
	$: if ($tagQuery.isStale) {
		console.log('THIS QUERY IS STALE!!');
		console.log({ $query: $tagQuery });
	}
</script>

<Button
	on:click={() => {
		queryClient.invalidateQueries({ queryKey: queryKeys.tags._def });
	}}
>
	INVALIDATE
</Button>

{$tagQuery.isStale}

<div class="space-y-4">
	<div class="flex items-center justify-between">
		<H1 class="flex items-baseline space-x-3">
			<TagIcon />
			<span>
				{data.tag.name}
			</span>
		</H1>
		<PinButton pin_id={data.tag.pin_id}>
			<input type="hidden" name="tag_id" value={data.tag.id} />
		</PinButton>
	</div>
	{#if $tagQuery.isLoading}
		<div class="flex flex-col">
			<EntryItemSkeleton />
			<EntryItemSkeleton />
			<EntryItemSkeleton />
			<EntryItemSkeleton />
			<EntryItemSkeleton />
		</div>
	{:else if $tagQuery.isSuccess}
		<EntryList
			class="mt-8"
			bulkForm={data.bulkForm}
			entries={$tagQuery.data?.pages.flatMap((page) => page.entries) ?? []}
			on:end={async () => {
				console.log('end', $tagQuery);
				$tagQuery.fetchNextPage();
			}}
		/>
	{/if}
</div>
