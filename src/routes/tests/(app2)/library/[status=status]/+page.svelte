<script lang="ts">
	import { navigating, page } from '$app/stores';
	import EntryItem from '$components/entries/EntryItem.svelte';
	import LibraryHeader from '$components/library/library-header.svelte';
	import inView from '$lib/actions/inview';
	import EntryItemSkeleton from '$lib/components/entries/EntryItemSkeleton.svelte';
	import { QueryOutput, query as qquery } from '$lib/queries/query';
	import { init_entries, invalidated } from '$lib/state/entries';
	import { createInfiniteQuery, useQueryClient } from '@tanstack/svelte-query';
	import { createWindowVirtualizer } from '@tanstack/svelte-virtual';
	import { overrideItemIdKeyNameBeforeInitialisingDndZones } from 'svelte-dnd-action';
	import { derived } from 'svelte/store';
	import { useMenuBar } from '../../MainNav.svelte';
	import { beforeNavigate } from '$app/navigation';
	import { backContext, setBackContext } from '../../(listables)/[type=type]/[id]/store';
	import { flip } from 'svelte/animate';
	import { queryFactory } from '$lib/queries/querykeys';
	import { checkedEntries, SelectActions } from '$components/entries/multi-select';

	overrideItemIdKeyNameBeforeInitialisingDndZones('key');

	export let data;

	const query = createInfiniteQuery(
		derived(page, ($page) =>
			queryFactory.entries.list({
				status: data.Status,
				type: data.type,
				search: $page.url.searchParams.get('search') ?? undefined
			})
		)
	);

	query.subscribe((q) => {
		console.log(`[query change]`, q);
	});

	$: entries =
		$query.data?.pages
			.flatMap((page) => page.entries)
			.filter((entry) => entry.status === data.Status) ?? [];

	// <!-- probably not smart -->
	$: if ($query.data) init_entries($query.data.pages.flatMap((page) => page.entries));

	$: console.log({ $query });

	const queryClient = useQueryClient();

	let can_restore = false;

	$: if ($navigating) {
		console.log({ $invalidated });
		can_restore = $navigating.type === 'popstate' && !$invalidated;
	}

	const virtualizer = createWindowVirtualizer({
		count: entries?.length || 0,
		estimateSize: () => 96,
		overscan: 7,
		getItemKey: (index) => entries[index]?.id
	});

	let items = $virtualizer?.getVirtualItems();
	let dragging = false;

	$: $virtualizer.setOptions({
		count: entries?.length || 0
	});

	$: console.log({ $virtualizer });
	$: {
		console.log({ entries });
		$virtualizer?.measure();
	}

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

    let checkLookup: Record<number, boolean> = {};


    // use in any entrylist
	beforeNavigate((nav) => setBackContext(nav, $page.url.toString()));
</script>

<LibraryHeader />
{#if $query.isLoading}
	{#each new Array(10) as _}
		<EntryItemSkeleton />
	{/each}
{:else}
	<!-- {@const entries = $query.data?.pages.flatMap((p) => p.entries) ?? []} -->
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
			<div
				animate:flip={{
                    duration: 200
                }}
				style="position: absolute; top:0; left: 0; width: 100%; height: {row.size}px; transform: translateY({row.start}px)"
			>
				<!-- on:move={() => {
							console.log(`got move, updating query`);
							const queryKey = [
								['get_library'],
								{
									input: {
										status: data.Status,
										type: data.type,
										search: $page.url.searchParams.get('search') ?? ''
									},
									type: 'infinite'
								}
							];
							queryClient.setQueryData(queryKey, (data) => data);
						}} -->
				<EntryItem bind:checked={$checkedEntries[entry.id]} {entry} />
			</div>
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

<SelectActions />
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
