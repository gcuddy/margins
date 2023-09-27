<script lang="ts">
	import { createInfiniteQuery } from '@tanstack/svelte-query';
	import {
		createWindowVirtualizer,
		defaultRangeExtractor,
	} from '@tanstack/svelte-virtual';
	import { Loader2Icon } from 'lucide-svelte';
	import type { ComponentType } from 'svelte';
	import { flip } from 'svelte/animate';
	import { derived, type Readable } from 'svelte/store';

	import { browser } from '$app/environment';
	import EntryItem from '$components/entries/EntryItem.svelte';
	import { entryTypeIcon } from '$components/entries/icons';
	import { checkedEntryIds } from '$components/entries/multi-select';
	import { create_multi } from '$components/entries/multi-select/multi';
	import BulkActions from '$components/ui/bulk-actions.svelte';
	import { Button } from '$components/ui/button';
	import { defaultViewPreferences } from '$components/view-preferences/view-preferences.schema';
	import EntryItemSkeleton from '$lib/components/entries/EntryItemSkeleton.svelte';
	import {
		convertToGroupedArrayWithHeadings,
		groupBy,
		type GroupedArrayWithHeadings,
	} from '$lib/helpers';
	import { initUpdateBookmarkMutation } from '$lib/queries/mutations';
	import type { QueryInput } from '$lib/queries/query';
	import { queryFactory } from '$lib/queries/querykeys';
	import type { LibraryResponse } from '$lib/server/queries';
	import { type Status, statuses } from '$lib/status';
	import { cn } from '$lib/utils';
	import { currentEntryList } from './store';
	import { beforeNavigate } from '$app/navigation';
	import { setBackContext } from '../../../routes/tests/(app2)/(listables)/[type=type]/[id]/store';
	import { page } from '$app/stores';

	export let opts: Readable<QueryInput<'get_library'>>;

	/** If provided, will filter on status explicitly. */
	export let status: Status | null = null;

	export let viewPreferences = defaultViewPreferences;

	const groupingEnabled = derived(
		opts,
		({ grouping }) => grouping && grouping !== 'none',
	);

	const updateBookmarkMutation = initUpdateBookmarkMutation();

	const query = createInfiniteQuery(
		derived(opts, ($opts) => queryFactory.entries.list($opts)),
	);

	const entries = derived(query, ($query) => {
		return (
			$query.data?.pages
				.flatMap((page) => page.entries)
				.filter((entry) => {
					if (!entry) {
						return false;
					}
					if (!status) {
						return true;
					}
					return entry.status === status;
				}) ?? []
		);
	});

    $: currentEntryList.set($entries)

	let groupedEntries: GroupedArrayWithHeadings<
		LibraryResponse['entries'][0],
		{
			count: number;
			icon?: ComponentType;
			id: string;
			isHeading: true;
			text: string;
		}
	> = [];
	$: {
		const grouped = groupBy($entries, (entry) => entry.type);
		groupedEntries = convertToGroupedArrayWithHeadings(grouped, (heading) => ({
			count: grouped.get(heading)?.length ?? 0,
			icon: entryTypeIcon[heading],
			id: heading,
			text: heading,
		}));
	}

	let activeHeaderIndex = 0;
	const isActiveHeader = (index: number) =>
		$groupingEnabled && activeHeaderIndex === index;

	let headerIndexes: Array<number> = [];
	$: headerIndexes = groupedEntries
		.map((entry, index) => {
			if (entry && 'isHeading' in entry && entry.isHeading) {
				return index;
			}
		})
		.filter((index) => index !== undefined) as Array<number>;

	// <!-- probably not smart -->
	$: if ($query.data) {
		// init_entries($query.data.pages.flatMap((page) => page.entries));
	}

	const virtualizer = createWindowVirtualizer({
		count: $groupingEnabled ? groupedEntries.length : $entries?.length || 0,
		estimateSize: (index) => {
			const entry = $groupingEnabled ? groupedEntries[index] : $entries[index];
			if (entry && 'isHeading' in entry && entry.isHeading) {
				return 40;
			}
			return 96;
		},
		getItemKey: (index) =>
			$groupingEnabled ? groupedEntries[index]!.id : $entries[index]!.id,
		overscan: 7,
		rangeExtractor: (range) => {
			if (!$groupingEnabled || !headerIndexes.length) {
				return defaultRangeExtractor(range);
			}

			activeHeaderIndex =
				headerIndexes.findLast((index) => range.startIndex >= index) ?? 0;
			// console.log({ activeHeaderIndex });

			const next = new Set([
				activeHeaderIndex,
				...defaultRangeExtractor(range),
			]);
			// console.log({ next });

			return [...next].sort((a, b) => a - b);
		},
	});

	$: $virtualizer.setOptions({
		count: $groupingEnabled ? groupedEntries.length : $entries?.length || 0,
	});

	$: {
		$virtualizer?.measure();
	}

	$: {
		const lastItem = $virtualizer.getVirtualItems().at(-1);
		if (
			lastItem &&
			lastItem?.index >= $entries?.length - 1 &&
			$query.hasNextPage &&
			!$query.isFetchingNextPage
		) {
			$query.fetchNextPage();
		}
	}

	const multi = create_multi({
		items: $entries?.map((e) => e.id) || [],
		selected: checkedEntryIds,
	});

	const {
		stores: { state },
	} = multi;

	export const capture = () => ({
		highlighted: $state.highlighted,
	});

	export const restore = (snapshot: { highlighted: number | null }) => {
		multi.helpers.setHighlighted(snapshot.highlighted);
	};

	$: multi.helpers.updateItems($entries.map((e) => e.id));

	// use in any entrylist
	beforeNavigate((nav) => setBackContext(nav, $page.url.toString()));

	const checkedEntries = derived(
		[checkedEntryIds, entries],
		([$checkedEntryIds, $entries]) => {
			return $entries.filter((entry) => $checkedEntryIds.includes(entry.id));
		},
	);
</script>

<svelte:window on:keydown={multi.events.keydown} />

{#if $query.isPending}
	{#each new Array(browser && innerHeight ? Math.ceil(innerHeight / 60) : 20) as _}
		<EntryItemSkeleton />
	{/each}
{:else}
	<!-- {@const entries = $query.data?.pages.flatMap((p) => p.entries) ?? []} -->
	<!-- use:dndzone={{
			items: $virtualizer.getVirtualItems()
		}} -->
	<div
		on:consider={(e) => {
			// dragging = true;
			// console.log({ e });
			// items = e.detail.items;
			// scroll into viwe
			const el = document.getElementById('dnd-action-dragged-el');
			// check rect
			const rect = el?.getBoundingClientRect();
			// console.log({ rect });
			// get window height
			const windowHeight = window.innerHeight;
			// check if in view
			if (
				rect?.top &&
				rect?.bottom &&
				(rect.top < 0 || rect.bottom > windowHeight)
			) {
				if (document.scrollingElement?.scrollTop) {
					$virtualizer.scrollToOffset(
						document.scrollingElement?.scrollTop + rect.top - 100,
						{
							behavior: 'smooth',
						},
					);
				}
			}
		}}
		style:height="{$virtualizer.getTotalSize()}px"
		class="w-full relative"
		use:multi.elements.root
        data-sveltekit-preload-code="viewport"
	>
		{#each $virtualizer.getVirtualItems() as row (row.key)}
			{@const entry = $groupingEnabled
				? groupedEntries[row.index]
				: $entries[row.index]}
			<div
				animate:flip={{
					duration: 200,
				}}
				class={cn(isActiveHeader(row.index) && 'bg-background z-[1]')}
				style:position={isActiveHeader(row.index) ? 'sticky' : 'absolute'}
				style:left="0"
				style:width="100%"
				style:height="{row.size}px"
				style:top={isActiveHeader(row.index) ? 'var(--nav-height)' : '0'}
				style:transform={isActiveHeader(row.index)
					? undefined
					: `translateY(${row.start}px)`}
			>
				{#if entry && 'isHeading' in entry && entry.isHeading}
					<!-- then we have a heading -->
					<div
						class="h-full w-full flex items-center px-6 bg-secondary/75 gap-x-4"
					>
						<svelte:component
							this={entry.icon}
							class="h-4 w-4 text-muted-foreground"
						/>
						<span class="text-lg tracking-tighter font-medium"
							>{entry.text}</span
						>
					</div>
				{:else if entry && !('isHeading' in entry)}
					<EntryItem
						{viewPreferences}
						on:change={() => multi.helpers.toggleSelection(entry.id)}
						data-active={$state.highlighted === entry.id}
						data-id={entry.id}
						checked={$checkedEntryIds.includes(entry.id)}
						{entry}
					/>
				{/if}
			</div>
		{:else}
			<div class="py-16 text-center text-sm bg-background">
				No entries found

				<!-- <pre>{JSON.stringify($query, null, 2)}</pre> -->
			</div>
		{/each}
		{#if $query.isFetchingNextPage}
			<div
				class="absolute bottom-0 left-0 right-0 flex justify-center items-center h-12"
			>
				<Loader2Icon class="h-4 w-4 animate-spin text-muted-foreground" />
			</div>
		{/if}
		<!-- <Intersector
			cb={() => {
				console.log(`Intersect`, { $query });
				$query.hasNextPage && !$query.isFetchingNextPage && $query.fetchNextPage();
			}}
		/> -->
		<!-- <EntryList {entries} /> -->
		<!-- <Scroller items={$query.data?.pages.flatMap((p) => p.entries) ?? []}  key={"id"}>
        <svelte:fragment slot="item" let:item={entry}>
        <EntryItem {entry} />
            <div>
                {entry.title}
            </div>
        </svelte:fragment>
    </Scroller> -->
	</div>
	<!-- {#each $query.data?.pages.flatMap((p) => p.entries) ?? [] as entry}
	{/each} -->
{/if}

<BulkActions length={$checkedEntryIds.length}>
	<slot name="actions" checkedEntries={$checkedEntries} clear={checkedEntryIds.clear}>
		{#each statuses as status}
			{#if $checkedEntries.every((entry) => entry.status !== status)}
				<Button
					on:click={() => {
						$updateBookmarkMutation.mutate({
							data: {
								status,
							},
							entryId: $checkedEntryIds,
						});
						multi.helpers.deselectAll();
					}}>Move to {status}</Button
				>
			{/if}
		{/each}
	</slot>
</BulkActions>
