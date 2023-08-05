<script lang="ts">
	import { navigating, page } from '$app/stores';
	import EntryItem from '$components/entries/EntryItem.svelte';
	import LibraryHeader from '$components/library/library-header.svelte';
	import inView from '$lib/actions/inview';
	import EntryItemSkeleton from '$lib/components/entries/EntryItemSkeleton.svelte';
	import { QueryOutput, query as qquery } from '$lib/queries/query';
	import { init_entries, invalidated } from '$lib/state/entries';
	import { createInfiniteQuery } from '@tanstack/svelte-query';
	import { createWindowVirtualizer } from '@tanstack/svelte-virtual';
	import { overrideItemIdKeyNameBeforeInitialisingDndZones } from 'svelte-dnd-action';
	import { derived } from 'svelte/store';
	import { useMenuBar } from '../../MainNav.svelte';

	overrideItemIdKeyNameBeforeInitialisingDndZones('key');

	export let data;

	const query = createInfiniteQuery(
		derived(page, ($page) => ({
			queryKey: [
				['get_library'],
				{
					input: {
						status: data.Status,
						type: data.type,
						search: $page.url.searchParams.get('search') ?? ''
					},
					type: 'infinite'
				}
			],
			queryFn: ({ queryKey, pageParam }) =>
				qquery($page, 'get_library', {
					status: data.Status,
					type: data.type,
					search: $page.url.searchParams.get('search') ?? '',
					cursor: pageParam
				}),
			// ...libraryQuery($page, {
			// 	status: data.Status,
			// 	type: data.type,
			// 	search: $page.url.searchParams.get('search') ?? ''
			// }),
			getNextPageParam: (lastPage) => lastPage.nextCursor,
			defaultPageParam: <QueryOutput<'get_library'>['nextCursor']>null
		}))
	);

	$: entries = $query.data?.pages.flatMap((page) => page.entries) ?? [];

	// <!-- probably not smart -->
	$: if ($query.data) init_entries($query.data.pages.flatMap((page) => page.entries));

	$: console.log({ $query });

	let can_restore = false;

	$: if ($navigating) {
		console.log({ $invalidated });
		can_restore = $navigating.type === 'popstate' && !$invalidated;
	}

	const virtualizer = createWindowVirtualizer({
		count: entries?.length || 0,
		estimateSize: () => 96,
		overscan: 5,
		getItemKey: (index) => entries[index]?.id
	});

	let items = $virtualizer?.getVirtualItems();
	let dragging = false;

	$: $virtualizer.setOptions({
		count: entries?.length || 0
	});

	let contentRect: DOMRectReadOnly | null = null;
	$: console.log({ contentRect });

	$: {
		const lastItem = $virtualizer.getVirtualItems().at(-1);
		if (
			lastItem &&
			lastItem?.index >= entries?.length - 1 &&
			$query.hasNextPage &&
			!$query.isFetchingNextPage
		) {
			console.log('fetching next page');
			$query.fetchNextPage();
		}
	}

	const menu = useMenuBar();
</script>

<div
	class=""
	use:inView
	on:exit={() => {
		$menu.centerComponent = LibraryHeader;
	}}
	on:enter={() => {
		$menu.centerComponent = undefined;
	}}
>
	<LibraryHeader />
</div>
{#if $query.isLoading}
	{#each new Array(10) as _}
		<EntryItemSkeleton />
	{/each}
{:else}
	{@const entries = $query.data?.pages.flatMap((p) => p.entries) ?? []}
	<!-- use:dndzone={{
			items: $virtualizer.getVirtualItems()
		}} -->
	<div
		on:consider={(e) => {
			dragging = true;
			console.log({ e });
			items = e.detail.items;
			// scroll into viwe
			const el = document.getElementById('dnd-action-dragged-el');
			// check rect
			const rect = el?.getBoundingClientRect();
			console.log({ rect });
			// get window height
			const windowHeight = window.innerHeight;
			// check if in view
			if (rect?.top && rect?.bottom && (rect.top < 0 || rect.bottom > windowHeight)) {
				// scroll into view
				console.log('Not in view');
				$virtualizer.scrollToOffset(document.scrollingElement?.scrollTop + rect.top - 100, {
					behavior: 'smooth'
				});
			}
			// el?.scrollIntoView({
			//     behavior: 'smooth',
			//     block: 'center',
			//     inline: 'center'
			// });
		}}
		style:height="{$virtualizer.getTotalSize()}px"
		class="w-full relative"
	>
		{#each $virtualizer.getVirtualItems() as row (row.key)}
			{@const entry = entries[row.index]}
			{#if entry}
				<div
					style="position: absolute; top:0; left: 0; width: 100%; height: {row.size}px; transform: translateY({row.start}px)"
				>
					<EntryItem {entry} />
				</div>
			{/if}
		{/each}
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
