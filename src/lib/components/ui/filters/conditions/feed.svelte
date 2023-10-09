<script lang="ts">
	import { queryFactory } from '$lib/queries/querykeys';
	import { getHostname } from '$lib/utils';
	import { createQuery } from '@tanstack/svelte-query';
	import { derived, writable } from 'svelte/store';
	import FilterPopover from '../filter-popover.svelte';
	import { Subscriptions } from '$lib/commands';
	import type { ComboboxOption } from '$components/ui/command2/store';
	import type { FilterLibrarySchema } from '$lib/schemas/library';
	import { ctx } from '../ctx';
	import type { QueryOutput } from '$lib/queries/query';

	const feedQuery = createQuery(queryFactory.subscriptions.all());

	const {
		helpers: { navigateSearch },
	} = ctx.get();

	export let id: number[] = [];
	export let type: keyof NonNullable<FilterLibrarySchema['feed']>;

	const selectedFeeds = derived(feedQuery, ($feedQuery) => {
		return $feedQuery.data?.filter((f) => id.includes(f.feedId)) ?? [];
	});

	const selectedValue = writable<
		Array<ComboboxOption<QueryOutput<'list_subscriptions'>[number]>>
	>([]);
	// TODO: this is not so satisfactory, but it works
	$: $selectedValue = $selectedFeeds.map((feed) => ({
		label: feed.title,
		value: feed,
	}));
</script>

<!-- TODO... -->
<FilterPopover multiple {selectedValue}>
	<div class="flex gap-1" slot="trigger">
		<div class="flex -space-x-2 shrink-0">
			{#each $selectedValue.slice(0, 3) as feed}
				{@const hostname = getHostname(feed.value.link || feed.value.feedUrl || '')}
				<img
					src={feed.value.imageUrl || `https://icon.horse/icon/${hostname}`}
					class="h-4 w-4 rounded-full border border-background"
					alt=""
				/>
			{/each}
		</div>
		<span class="truncate">
			{#key $selectedValue}
				{#if $selectedValue.length === 1}
					{#each $selectedValue as feed}
						{feed.value.title}
					{/each}
				{:else if $selectedValue.length > 1}
					{$selectedValue.length} feeds
				{/if}
			{/key}
		</span>
	</div>
	<Subscriptions
		slot="commands"
		onSelect={(s) => {
			navigateSearch((data) => {
				const existingIds = data.feed?.[type] ?? [];
				const newData = {
					...data,
					feed: {
						...data.feed,
						[type]: existingIds.includes(s.feedId)
							? existingIds.filter((id) => id !== s.feedId)
							: [...existingIds, s.feedId],
					},
				};
				console.log({ newData });
				return newData;
			});
		}}
	/>
</FilterPopover>
