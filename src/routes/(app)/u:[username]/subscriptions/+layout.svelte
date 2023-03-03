<script lang="ts">
	import { page } from "$app/stores";
	import SmallPlus from "$lib/components/atoms/SmallPlus.svelte";
	import Button from "$lib/components/Button.svelte";
	import Dialog from "$lib/components/Dialog.svelte";
	import FeedModal from "$lib/components/FeedModal.svelte";
	import Filter from "$lib/components/Filters/Filter.svelte";
	import FilterDisplay from "$lib/components/Filters/FilterDisplay.svelte";
	import FiltersList from "$lib/components/Filters/FiltersList.svelte";
	import SearchInput from "$lib/components/Filters/SearchInput.svelte";
	import type { ChildOption } from "$lib/components/Filters/SimpleFilter.svelte";
	import Icon from "$lib/components/helpers/Icon.svelte";
	import Header from "$lib/components/layout/Header.svelte";
	import DefaultHeader from "$lib/components/layout/headers/DefaultHeader.svelte";
	import ModalContainer from "$lib/components/modals/ModalContainer.svelte";
	import { modals } from "$lib/stores/modals";
	import type { RouterOutputs } from "$lib/trpc/router";
	import type { Prisma } from "@prisma/client";
	import { ComponentProps, setContext } from "svelte";
	import { writable } from "svelte/store";
	import type { LayoutData } from "./$types";
	import FeedTitleMenu from "./FeedTitleMenu.svelte";
	export let data: LayoutData;
	let modal = false;
	type Entries = RouterOutputs["entries"]["byFeed"]["entries"];
	$: entries = ($page.data.entries || []) as Entries;

	const disableAnimation = writable(false);
	setContext("disableAnimation", disableAnimation);

	let filterOptions: ChildOption<Entries[number]>[] = [
		{
			name: "Unread",
			id: "unread",
			icon: "unread",
			parent: "Entry",
			// prisma: {
			// 	unread: true,
			// 	published: {
			// 		gt: dayjs().subtract(1, 'w')
			// 	}
			// },
			filter: (i) => i.unread,
			negated: (i) => !i.unread,
			// prisma: {
			// 	// TODO: have to assume we're passing in userid
			// 	createdAt: {
			// 		lt: "1week", //needs to be relative time
			// 	},
			// 	interactions: {
			// 		some: {
			// 			is_read: true,
			// 		},
			// 	},
			// },
		},
	];
</script>

<Filter
	searchKeys={["title"]}
	values={entries || []}
	let:searchTerm
	let:filters
	let:filteredItems
	let:_filters
>
	<Header>
		<DefaultHeader>
			<div slot="start" class="flex items-center gap-2">
				{#if $page.data.subscription}
					<FeedTitleMenu subscription={$page.data.subscription} />
				{:else}
					<div><SmallPlus>{$page.data.title || "Subscriptions"}</SmallPlus></div>
				{/if}
				{#if $page.data.entries}
					<div>
						{#if !_filters.length}
							<FilterDisplay {filters} options={filterOptions} />
						{:else}
							<Button variant="dashed" className="space-x-1 text-sm" on:click={() => filters.reset()}>
								<Icon name="xMarkMini" className="h-4 w-4 dark:fill-gray-300" /> <span>Clear Filters</span>
							</Button>
						{/if}
					</div>
				{/if}
			</div>
			<div class="flex gap-2" slot="end">
				<Button
					variant="ghost"
					as="a"
					href="/u:{$page.params.username}/subscriptions/new"
					on:click={(e) => {
						e.preventDefault();
						modals.open(FeedModal, {}, "feed-entry");
						modal = true;
					}}
				>
					<Icon name="plusSmall" className="h-5 w-5 fill-current" />
					<span>Add Subscription</span></Button
				>
				<button
					on:click={async () => {
						const res = await fetch("/api/refresh", {
							method: "POST",
						});
						const json = await res.json();
						console.log({ json });
					}}>refresh</button
				>
			</div>
		</DefaultHeader>
	</Header>
	<div class="flex grow flex-col overflow-hidden">
		{#if filteredItems}
			<div>
				<SearchInput value={searchTerm} on:active={({ detail: active }) => disableAnimation.set(active)} />
			</div>
			{#if _filters.length}
				<div class="p-3">
					<FiltersList {filters} options={filterOptions} />
				</div>
			{/if}
		{/if}
		<slot />
	</div>
</Filter>
<!-- <Dialog open={modal}>
	<FeedModal />
</Dialog> -->
