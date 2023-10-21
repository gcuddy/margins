<script lang="ts">
	import {
		createInfiniteQuery,
		keepPreviousData,
		useQueryClient,
	} from '@tanstack/svelte-query';
	import {
		createWindowVirtualizer,
		defaultRangeExtractor,
	} from '@tanstack/svelte-virtual';
	import { Loader2Icon } from 'lucide-svelte';
	import type { ComponentType } from 'svelte';
	import { flip } from 'svelte/animate';
	import { derived, writable } from 'svelte/store';

	import { browser } from '$app/environment';
	import { beforeNavigate, goto } from '$app/navigation';
	import { page } from '$app/stores';
	import EntryItem from '$components/entries/EntryItem.svelte';
	import { entryTypeIcon } from '$components/entries/icons';
	import { checkedEntryIds } from '$components/entries/multi-select';
	import { create_multi } from '$components/entries/multi-select/multi';
	import LibraryHeader from '$components/library/library-header.svelte';
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
	import { queryFactory } from '$lib/queries/querykeys';
	import {
		type FilterLibrarySchema,
		filterLibrarySchema,
		type LibraryGroupType,
		type LibrarySortType,
	} from '$lib/schemas/library';
	import type { LibraryResponse } from '$lib/server/queries';
	import { statuses } from '$lib/status';
	import { cn } from '$lib/utils';
	import {
		defaultParseSearch,
		defaultStringifySearch,
	} from '$lib/utils/search-params';

	import { setBackContext } from '../../(listables)/[type=type]/[id]/store';
	import type { Snapshot } from './$types.js';
	import LibraryTabs from '$components/library/library-tabs.svelte';
	import Header from '$components/ui/Header.svelte';
	import { audioPlayer } from '$components/AudioPlayer.svelte';

	export let data;

	const sort = writable<NonNullable<LibrarySortType>>('manual');
	const dir = writable<'asc' | 'desc'>('asc');
	const grouping = writable<LibraryGroupType>('none');
	const groupingEnabled = derived(
		grouping,
		($grouping) => $grouping && $grouping !== 'none',
	);

	$: if (browser && $sort && $sort !== 'manual') {
		const url = $page.url;
		url.searchParams.set('sort', $sort);
		goto(url, {
			keepFocus: true,
			noScroll: true,
			replaceState: true,
		});
	} else if (browser) {
		const url = $page.url;
		url.searchParams.delete('sort');
		goto(url, {
			keepFocus: true,
			noScroll: true,
			replaceState: true,
		});
	}

	const updateBookmarkMutation = initUpdateBookmarkMutation();

	function parseFilterFromSearchParams(): FilterLibrarySchema | undefined {
		const rawObj = defaultParseSearch($page.url.search);
		console.log({ rawObj });
		const parsed = filterLibrarySchema.safeParse(rawObj);
		console.log({ parsed });
		if (parsed.success) {
			return parsed.data;
		}
	}

	const filter = derived(page, ($page) => parseFilterFromSearchParams());

	const queryClient = useQueryClient();

	const query = createInfiniteQuery(
		derived(
			[page, sort, dir, grouping, filter],
			([$page, $sort, $dir, $grouping, $filter]) => {
				const search = $page.url.searchParams.get('search') ?? undefined;
				return {
					...queryFactory.entries.list(
						{
							dir: $dir,
							filter: $filter,
							grouping: $grouping === 'none' ? undefined : $grouping,
							library: true,
							search,
							sort: $sort,
							status: $page.data.Status,
						},
						queryClient,
					),
					placeholderData: keepPreviousData,
					// placeholderData: (data: InfiniteData<LibraryResponse> | undefined) => {
					// 	console.log(`placeholder`, { data });
					// 	if (search && data) {
					// 		// perform search
					// 		const searchRegex = new RegExp(search, 'i');
					// 		return {
					// 			...data,
					// 			pages: data.pages.map((page) => ({
					// 				...page,
					// 				entries: page.entries.filter((entry) => {
					// 					const title = entry.title;
					// 					const author = entry.bookmark_author ?? entry.author;
					// 					if (!title && !author) return false;
					// 					return searchRegex.test(`${title} ${author}`);
					// 				})
					// 			}))
					// 		};
					// 	}
					// 	return data;
					// }
				};
			},
		),
	);

	const entries = derived(query, ($query) => {
		return (
			$query.data?.pages
				.flatMap((page) => page.entries)
				.filter((entry) => {
					if (!entry) {
						return false;
					}
					if (!data.Status) {
						return true;
					}
					return entry.status === data.Status;
				}) ?? []
		);
	});

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
		// when entries changes...
		$entries;
		$virtualizer?.measure();
		console.log('measure');
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
	// $: console.log({ $state });

	export const snapshot: Snapshot = {
		capture: () => ({
			highlighted: $state.highlighted,
		}),
		restore: (snapshot) => {
			multi.helpers.setHighlighted(snapshot.highlighted);
		},
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

	$: viewPreferences =
		data.viewPreferences.preferences ?? defaultViewPreferences;
</script>

<svelte:window on:keydown={multi.events.keydown} />

<LibraryHeader
	loading={$query.isLoading}
	bind:sort={$sort}
	bind:dir={$dir}
	bind:grouping={$grouping}
	bind:viewPreferences
	saveViewUrl="/views/explore/library{defaultStringifySearch({
		...$filter,
		status: $page.data.Status ? $page.data.Status : undefined,
	})}"
	viewPreferencesId={data.viewPreferences.id}
>
	<svelte:fragment slot="buttons">
		<div class="hidden sm:flex">
			<LibraryTabs showIcons />
		</div>
	</svelte:fragment>
</LibraryHeader>

<!-- <Header>
</Header> -->

{#if $query.isPending}
	{#each new Array(browser && innerHeight ? Math.ceil(innerHeight / 60) : 20) as _}
		<EntryItemSkeleton />
	{/each}
{:else if $query.data}
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
				// scroll into view
				// console.log('Not in view');
				if (document.scrollingElement?.scrollTop) {
					$virtualizer.scrollToOffset(
						document.scrollingElement?.scrollTop + rect.top - 100,
						{
							behavior: 'smooth',
						},
					);
				}
			}
			// el?.scrollIntoView({
			//     behavior: 'smooth',
			//     block: 'center',
			//     inline: 'center'
			// });
		}}
		style:height="{$virtualizer.getTotalSize()}px"
		class="w-full relative"
		use:multi.elements.root
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
			{#if $query.data.pages.length === 0}
				<div class="py-16 text-center text-sm bg-background">
					No entries found

					<!-- <pre>{JSON.stringify($query, null, 2)}</pre> -->
				</div>
			{/if}
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

<div
	class={cn(
		'fixed z-40 justify-center flex left-0 right-0 sm:hidden',
		$audioPlayer?.audio?.src ? 'bottom-40' : 'bottom-20',
	)}
>
	<div class="">
		{#if $checkedEntryIds.length}
			<BulkActions styled={false} length={$checkedEntryIds.length}>
				{#each statuses as status}
					{#if $checkedEntries.every((entry) => entry.status !== status)}
						<Button
                            variant="outline"
                            size="sm"
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
			</BulkActions>
		{:else}
			<LibraryTabs showIcons />
		{/if}
	</div>
</div>

<BulkActions class="max-sm:hidden" length={$checkedEntryIds.length}>
	{#each statuses as status}
		{#if $checkedEntries.every((entry) => entry.status !== status)}
			<Button
                variant="outline"
                size="sm"
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
</BulkActions>

<!-- <EntryList
	loading={$query.isLoading}
	bind:this={entryList}
	class="mt-4"
	status={data.status}
	bulkForm={data.bulkForm}
	on:move={(e) => {
		library_tabs.move_entries(e.detail.entries, e.detail.status);
		// mutate data object (!)
		e.detail.entries.forEach((entry) => {
			// TODO
			const index = data.entries.findIndex((e) => e.id === entry.id);
			data.entries[index].status = e.detail.status;
		});
	}}
	entries={$query.data?.pages.flatMap((p) => p.entries) ?? []}
	on:end={() => $query.hasNextPage && !$query.isFetchingNextPage && $query.fetchNextPage()}
/> -->
<!-- {#if data.next}
		<a
			href="{$page.url.pathname}?after_sort={data.next.sort_order}&after_updated={data.next
				.updatedAt}">next page</a
		>
	{/if} -->
