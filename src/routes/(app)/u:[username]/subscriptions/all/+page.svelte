<script lang="ts">
	import EntryList from "$lib/components/EntryList.svelte";
	import { createInfiniteQuery } from "@tanstack/svelte-query";
	import type { FilterStores } from "$lib/stores/filter";
	import { getContext, onDestroy, onMount } from "svelte";
	import { DEFAULT_RSS_VIEW_OPTIONS } from "../view_options";
	import type { PageData } from "./$types";
	import { trpc, trpcWithQuery } from "$lib/trpc/client";
	import type { Entry } from "@prisma/client";
	import { page } from "$app/stores";
	import {
		createVirtualizer,
		SvelteVirtualizer,
		Virtualizer,
	} from "@tanstack/svelte-virtual";
	import type { Readable } from "svelte/store";
	import resize from "$lib/actions/resize";
	import { mainEl } from "$lib/stores/main";
	import {
		dndzone,
		overrideItemIdKeyNameBeforeInitialisingDndZones,
		SHADOW_ITEM_MARKER_PROPERTY_NAME,
		SHADOW_PLACEHOLDER_ITEM_ID,
	} from "svelte-dnd-action";
	import autoAnimate from "@formkit/auto-animate";
	import { getHostname } from "$lib/utils";
	import dayjs from "$lib/dayjs";
	import KeyboardNav from "$lib/components/helpers/KeyboardNav/KeyboardNav.svelte";
	import KeyboardNavItem from "$lib/components/helpers/KeyboardNav/KeyboardNavItem.svelte";
	import List from "$lib/components/helpers/List.svelte";
	import { goto } from "$app/navigation";
	import { syncStore } from "$lib/stores/sync";
	import Autosizer from "$lib/components/helpers/Autosizer.svelte";
	import { getCurrentListContext } from "$lib/stores/currentList";

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
	const v = createVirtualizer({
		count: $query?.hasNextPage
			? $filteredItems.length + 1
			: $filteredItems.length,
		overscan: 5,
		getScrollElement: () => ref,
		estimateSize: () => 40,
		getItemKey: (index) => $filteredItems[index]?.id,
		debug: true,
		initialRect: {
			height: 800,
			width: 100,
		},
		// getItemKey,
	});

	onMount(() => {
		virtualizer = createVirtualizer({
			count: $query?.hasNextPage
				? $filteredItems.length + 1
				: $filteredItems.length,
			overscan: 0,
			getScrollElement: () => (ref ? ref : null),
			estimateSize: () => 40,
			getItemKey: (index) => $filteredItems[index]?.id,
			debug: true,
			// getItemKey,
		});
	});
	// TODO: pick up here 2023-01-17
	$: $filteredItems,
		$v?.setOptions({
			...$v.options,
			count: $query?.hasNextPage
				? $filteredItems.length + 1
				: $filteredItems.length,
		});

	$: if ($v && $filteredItems) {
		const lastItem = $v.getVirtualItems().at(-1);
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
	let height = 600;
	function handleResize(r: ResizeObserverEntry) {
		const { blockSize } = r.borderBoxSize[0];
		console.log({ blockSize });
		console.log($mainEl);
		height = 600;
		// height = window.innerHeight - blockSize - 32;
	}
	let draggedOver;

	const current_list = getCurrentListContext();
	$: current_list.set({
		entries: $filteredItems,
		slug: $page.url.pathname,
	});
</script>

<!-- {#each data.entries as entry}
	<a href="/u:{data.user.username}/entry/{entry.id}">{entry.title}</a>
{/each} -->
<div class="flex grow flex-col">
	<List
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
		{@const item = $filteredItems[virtualRow.index]}
		{@const isLoaderRow = virtualRow.index > $filteredItems.length - 1}
		<!-- {@const subscription = data.subscriptions.find(
			(s) => s.feedId === item?.feedId
		)} -->
		<!-- {JSON.stringify(item.title)} -->
		<a
			href={`/u:${$page.params.username}/entry/${item.id}`}
			class="flex min-w-0 grow p-2 {active ? 'bg-sky-400/50' : ''}"
		>
			<div class="flex items-center truncate p-2">
				<div class="flex w-36 flex-none items-center gap-2">
					<!-- favicon -->
					<div class="h-4 w-4 shrink-0 overflow-hidden rounded">
						{#if item.uri}
							<!-- <img src="https://icon.horse/icon/{getHostname(item.uri)}" /> -->
							<!-- <img src="https://icon.horse/icon/{getHostname(item.uri)}" alt="" /> -->
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
					<!-- {item.text} -->
				</div>
				<div class="ml-auto mr-1 flex flex-none flex-row-reverse">
					<time>
						{#if item.published}
							<!-- {displayTime(item.published)} -->
						{/if}
					</time>
					<!-- {} -->
				</div>
			</div>
		</a>
		{#if isLoaderRow}
			loading...
		{/if}
	</List>
</div>
<!-- {draggedOver}
{$filteredItems.length} items
{$v.getVirtualItems().length} vitems -->
{#if $query.isLoading}
	loading
{:else if false}
	<!-- TODO: make this into a component -->
	<!-- <EntryList items={$filteredItems} viewOptions={DEFAULT_RSS_VIEW_OPTIONS} /> -->
	<div class="h-96 grow overflow-auto will-change-transform">
		{#if v}
			<!-- {JSON.stringify($v.getVirtualItems())} -->
			<!-- use:dndzone={{
					items: $v.getVirtualItems(),
					dragDisabled: $filteredItems.length !== $items.length,
				}} -->
			<div
				on:consider={(e) => {
					// TODO:
					console.log("consider", e);
					// $items = e.detail.items.filter((i) => i.is);
					const newItems = e.detail.items.map((i) => $items[i.index]);
					draggedOver = e.detail.info.id;
					console.log({ SHADOW_PLACEHOLDER_ITEM_ID });
					// $items = [];
					// items.update(($items) => {
					// 	newItems.forEach((item) => {
					// 		const idx = $items.findIndex((i) => i.id === item.id);
					// 		$items[idx] = item;
					// 	});
					// 	return $items;
					// });
					// $items = $items;
					// console.log({ newItems, $items });
					// $items = newItems;
				}}
				on:finalize={() => {
					console.log({ $items, items: $v.getVirtualItems() });
					// $items = $items;
				}}
				style="height: {$v.getTotalSize()}px; width: 100%; position: relative"
			>
				{#each $v.getVirtualItems() as virtualRow, index}
					{@const item = $filteredItems[virtualRow.index]}
					{@const isLoaderRow = virtualRow.index > $filteredItems.length - 1}
					<!-- {@const subscription = data.subscriptions.find(
						(s) => s.feedId === item?.feedId
					)} -->
					<!-- {JSON.stringify(item.title)} -->
					{#if !isLoaderRow}
						<div
							class="flex"
							class:odd={virtualRow.index % 2}
							style="height: {virtualRow.size}px; transform: translateY({virtualRow.start}px); position: absolute; top:0; left:0; width: 100%;"
						>
							<a
								href={`/u:${$page.params.username}/entry/${item.id}`}
								class="min-w-0 grow p-2"
							>
								<div class="flex items-center truncate p-2">
									<div class="flex w-36 flex-none items-center gap-2">
										<!-- favicon -->
										<div class="h-4 w-4 shrink-0 overflow-hidden rounded">
											{#if item.uri}
												<img
													src="https://icon.horse/icon/{getHostname(item.uri)}"
												/>
												<!-- <img src="https://icon.horse/icon/{getHostname(item.uri)}" alt="" /> -->
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
										<!-- {item.text} -->
									</div>
									<div class="ml-auto mr-1 flex flex-none flex-row-reverse">
										<time>
											{#if item.published}
												{displayTime(item.published)}
											{/if}
										</time>
										<!-- {} -->
									</div>
								</div>
							</a>
							<!-- {} -->
						</div>
						<!-- {#if $filteredItems.length === $items.length}
							{isLoaderRow ? ($query.hasNextPage ? "Loading..." : "") : item.title}
						{/if}
						{isLoaderRow ? ($query.hasNextPage ? "Loading..." : "") : item.title} -->
					{/if}
				{/each}
			</div>
		{/if}
		<!-- {#if virtualizer}
			<div style="height: {$virtualizer.getTotalSize()}px; width: 100%; position: relative">
				{#each $virtualizer.getVirtualItems() as virtualRow}
					{@const item = $filteredItems[virtualRow.index]}
					{@const isLoaderRow = virtualRow.index > $filteredItems.length - 1}

					<div
						class="row"
						class:odd={virtualRow.index % 2}
						style="height: {virtualRow.size}px; transform: translateY({virtualRow.start}px)"
					>
						{isLoaderRow ? ($query.hasNextPage ? "Loading..." : "Nothing more to load") : item.title}
					</div>
				{/each}
			</div>
		{/if} -->
	</div>
{/if}

<!-- <button on:click={() => $query.fetchNextPage()} disabled={!$query.hasNextPage || $query.isFetchingNextPage}>
	{#if $query.isFetching}
		Loading more...
	{:else if $query.hasNextPage}
		Load More
	{:else}Nothing more to load{/if}
</button> -->
<!-- <a href="{$page.url.pathname}?cursor={data.nextCursor}">Next page</a> -->
<!-- <noscript> Next link </noscript> -->
