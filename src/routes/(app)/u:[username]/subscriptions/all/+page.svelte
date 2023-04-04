<script lang="ts">
	import { page } from "$app/stores";
	import { EntryItem } from "$lib/components/entry-item";
	import Intersector from "$lib/components/Intersector.svelte";
	import ItemList from "$lib/components/ItemList.svelte";
	import Separator from "$lib/components/ui/Separator.svelte";
	import VirtualRow from "$lib/components/VirtualRow.svelte";
	import dayjs from "$lib/dayjs";
	import { getCurrentListContext } from "$lib/stores/currentList";
	import type { FilterStores } from "$lib/stores/filter";
	import { mainEl } from "$lib/stores/main";
	import { syncStore } from "$lib/stores/sync";
	import { trpcWithQuery } from "$lib/trpc/client";
	import { getHostname } from "$lib/utils";
	import type { Entry } from "@prisma/client";
	import {
		createVirtualizer,
		SvelteVirtualizer,
		createWindowVirtualizer,
	} from "@tanstack/svelte-virtual";
	import { afterUpdate, getContext, onDestroy, onMount } from "svelte";
	import { SHADOW_PLACEHOLDER_ITEM_ID } from "svelte-dnd-action";
	import type { Readable } from "svelte/store";
	import type { PageData } from "./$types";
	import type { Snapshot } from "./$types";

	export const snapshot: Snapshot = {
		capture: () => {
			const scroll = document.querySelector("main")?.scrollTop;
			console.log({ scroll });
			return scroll;
		},
		restore: (value) => {
			if (value) {
				document.querySelector("main")?.scrollTo(0, value);
			}
		},
	};

	dayjs.updateLocale("en", {
		relativeTime: {
			future: "in %s",
			past: "%s",
			s: "a few seconds",
			m: "a minute",
			mm: "%d minutes",
			h: "1h",
			hh: "%dh",
			d: "1d",
			dd: "%dd",
			M: "a month",
			MM: "%d months",
			y: "a year",
			yy: "%d years",
		},
	});

	const displayTime = (d: string) => {
		// if within last week display relative time
		const diff = dayjs().diff(dayjs(d), "d");
		if (diff < 7) {
			return dayjs(d).fromNow();
		} else if (dayjs(d).isSame(dayjs(), "y")) {
			return dayjs(d).format("DD MMM");
		} else {
			return dayjs(d).format("DD MMM YYYY");
		}
	};

	// dayjs.updateLocale
	// dayjs.updateLocale("en", {
	// 	relativeTime: {
	// 		H: "H",
	// 	},
	// });

	export let data: PageData;

	// overrideItemIdKeyNameBeforeInitialisingDndZones("key");

	const stores: FilterStores<Entry> = getContext("filter");

	const { filteredItems, items } = stores;

	const query = trpcWithQuery(
		$page
	).entries.listForUserSubscriptions.createInfiniteQuery(
		{
			take: 25,
		},
		{
			getNextPageParam: (lastPage) => lastPage.nextCursor,
		}
	);

	$: console.log({ $query, items: $query.data });

	let s: string | null = null;
	$: {
		if ($query.isLoading) {
			s = syncStore.add();
		} else if (s) {
			syncStore.remove(s);
		}
	}

	const u = query.subscribe((q) => {
		const entries = q.data?.pages.flatMap((p) => p.entries);
		console.log("entriesFromQuery", entries);
		if (entries && items) items.set(entries);
	});

	onDestroy(() => u);
	let virtualizer: Readable<SvelteVirtualizer<HTMLElement, Element>>;
	console.log({ items: $query.data });
	let ref: HTMLElement | null = null;

	$: windowVirtualizer = createWindowVirtualizer({
		count: $query?.hasNextPage
			? $filteredItems.length + 1
			: $filteredItems.length,
		estimateSize: () => 60,
		overscan: 5,
		getItemKey: (index) => $filteredItems[index]?.id,
		debug: true,
	});

	// const v = createVirtualizer({
	// 	count: $query?.hasNextPage
	// 		? $filteredItems.length + 1
	// 		: $filteredItems.length,
	// 	overscan: 5,
	// 	getScrollElement: () => ref,
	// 	estimateSize: () => 40,
	// 	getItemKey: (index) => $filteredItems[index]?.id,
	// 	debug: true,
	// 	initialRect: {
	// 		height: 800,
	// 		width: 100,
	// 	},
	// 	// getItemKey,
	// });

	// onMount(() => {
	// 	virtualizer = createVirtualizer({
	// 		count: $query?.hasNextPage
	// 			? $filteredItems.length + 1
	// 			: $filteredItems.length,
	// 		overscan: 0,
	// 		getScrollElement: () => (ref ? ref : null),
	// 		estimateSize: () => 40,
	// 		getItemKey: (index) => $filteredItems[index]?.id,
	// 		debug: true,
	// 		// getItemKey,
	// 	});
	// });
	// TODO: pick up here 2023-01-17
	$: $filteredItems,
		$windowVirtualizer?.setOptions({
			...$windowVirtualizer.options,
			count: $query?.hasNextPage
				? $filteredItems.length + 1
				: $filteredItems.length,
			scrollMargin: parentOffsetRef ?? 0,
		});

	$: if ($windowVirtualizer && $filteredItems) {
		const lastItem = $windowVirtualizer.getVirtualItems().at(-1);
		console.log({
			lastItemIndex: lastItem?.index,
			itemsLength: $items.length,
			$query,
		});
		if (
			lastItem?.index &&
			lastItem.index >= $items.length - 1 &&
			$query.hasNextPage &&
			!$query.isFetchingNextPage
		) {
			console.log(`lastitem Fetching`);
			$query.fetchNextPage();
		}
	}

	$: console.log({ $filteredItems });

	const current_list = getCurrentListContext();
	$: current_list.set({
		entries: $filteredItems,
		slug: $page.url.pathname,
	});
	let parentRef: HTMLElement | null = null;

	let parentOffsetRef: number | undefined = undefined;

	afterUpdate(() => {
		parentOffsetRef = parentRef?.offsetTop;
	});

	$: console.log({ parentOffsetRef });

	$: virtualItems = $windowVirtualizer.getVirtualItems();

	$: console.log({ $windowVirtualizer });

	$: entries = $query.data?.pages.flatMap((p) => p.entries) ?? [];
</script>

<!-- {#each data.entries as entry}
	<a href="/u:{data.user.username}/entry/{entry.id}">{entry.title}</a>
{/each} -->
<h2 class="text-2xl font-semibold tracking-tight">All items</h2>
<p class="text-sm text-gray-500 dark:text-gray-400">
	Catch up with new entries from your subscriptions.
</p>
<Separator class="my-4" />
<div class="flex grow flex-col" bind:this={parentRef}>
	<!-- TODO: eventually virtualizer -->
	<!-- {#each $query.data?.entries ?? [] as item} -->
	<ItemList {entries} />
	<Intersector
		cb={() => {
			// alert("intersector");
			if ($query.hasNextPage && !$query.isFetchingNextPage) {
				$query.fetchNextPage();
			}
		}}>Loading...</Intersector
	>
	<!-- <div
		class="relative w-full"
		style:height="{$windowVirtualizer.getTotalSize()}px"
	>
		<div
			class="absolute left-0 top-0 w-full"
			style:transform="translateY({virtualItems[0]?.start -
				$windowVirtualizer.options.scrollMargin})"
		>
			{#each virtualItems as row (row.key)}
				<VirtualRow ref={$windowVirtualizer.measureElement} item={row}>
					
				</VirtualRow>
			{/each}
		</div>
	</div> -->
	<!-- {#each $filteredItems as entry}
		<EntryItem {entry} />
	{/each} -->
	<!-- <List
		{height}
		opts={{
			count: $filteredItems.length,
			getItemKey: (index) => $filteredItems?.[index]?.id,
		}}
		let:virtualRow
		let:active
		on:end={() => {
			console.log("end");
			if ($query.hasNextPage && !$query.isFetchingNextPage) {
				console.log(`lastitem Fetching`);
				$query.fetchNextPage();
			}
		}}
		on:enter={({ detail }) => {
			let item = $filteredItems[detail.index];
			goto(`/u:${$page.params.username}/entry/${item.id}`);
			console.log({ item });
		}}
	>
		{@const entry = $filteredItems[virtualRow.index]}
		{@const isLoaderRow = virtualRow.index > $filteredItems.length - 1}
		<a
			href={`/u:${$page.params.username}/entry/${item.id}`}
			class="flex min-w-0 grow p-2 {active ? 'bg-sky-400/50' : ''}"
		>
			<div class="flex items-center truncate p-2">
				<div class="flex w-36 flex-none items-center gap-2">
					<div class="h-4 w-4 shrink-0 overflow-hidden rounded">
						{#if item.uri}
						{/if}
					</div>
					<div class="shrink truncate">
						{item.feed_title}
					</div>
				</div>
				<div class="ml-4 mr-4 block truncate">
					<div class="truncate">
						<span class="truncate">
							{item.title}
						</span>
					</div>
				</div>
				<div class="ml-auto mr-1 flex flex-none flex-row-reverse">
					<time>
						{#if item.published}
						{/if}
					</time>
				</div>
			</div>
		</a>
		{#if isLoaderRow}
			loading...
		{/if}
	</List> -->
</div>
<!-- {draggedOver}
{$filteredItems.length} items
{$v.getVirtualItems().length} vitems -->

<!-- <button on:click={() => $query.fetchNextPage()} disabled={!$query.hasNextPage || $query.isFetchingNextPage}>
	{#if $query.isFetching}
		Loading more...
	{:else if $query.hasNextPage}
		Load More
	{:else}Nothing more to load{/if}
</button> -->
<!-- <a href="{$page.url.pathname}?cursor={data.nextCursor}">Next page</a> -->
<!-- <noscript> Next link </noscript> -->
