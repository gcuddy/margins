<script lang="ts">
	import Saved from "$lib/components/Saved.svelte";
	import CustomizeView from "$lib/components/CustomizeView.svelte";
	import FavoriteStar from "$lib/components/FavoriteStar.svelte";
	import { notifications } from "$lib/stores/notifications";
	import { syncStore } from "$lib/stores/sync";
	import { ViewOptionsSchema, type ViewOptions } from "$lib/types/schemas/View";
	import { createFavorite, deleteFavorite, sortArticles } from "$lib/utils";
	import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@rgossiaux/svelte-headlessui";

	import Icon from "$lib/components/helpers/Icon.svelte";
	import Header from "$lib/components/layout/Header.svelte";
	import DefaultHeader from "$lib/components/layout/headers/DefaultHeader.svelte";
	import type { PageData } from "./$types";
	import { page } from "$app/stores";
	import SmallPlus from "$lib/components/atoms/SmallPlus.svelte";
	import EntryList from "$lib/components/EntryList.svelte";
	import ListItem from "$lib/components/layout/ListItem.svelte";
	// TODO: starred - should it only appear when there's just one tag?
	// TODO: cutomize view - per tag? per view? hmm...
	// introducing this /t:/t: tag thing is a bit weird... prefer views over this. but let's try it out for now.
	export let data: PageData;
	let viewOptions: ViewOptions | undefined;
</script>

<Header>
	<DefaultHeader>
		<div slot="start" class="flex items-center space-x-4">
			<div class="flex gap-2">
				<h1><a href="/u:{$page.params.username}">{$page.params.username}</a> /</h1>
				<h2 class="flex items-center space-x-1">
					<Icon name="tagMini" className="h-5 w-5 fill-current" /><span
						><SmallPlus>{data.tag.join(" + ")}</SmallPlus></span
					>
				</h2>
			</div>
			<!-- TODO: Edit Menu (rename, delete) -->
		</div>
		<div slot="end">view</div>
	</DefaultHeader>
</Header>

<TabGroup
	on:change={(e) => {
		console.log(e.detail);
		const url = $page.url;
		url.searchParams.set("t", e.detail);
		// window.history.pushState({}, '', url);
	}}
>
	<TabList>
		<Tab>Entries {data.items.length}</Tab>
		<!-- {data.lazy?.annotations} -->
		<Tab
			>Subscriptions
			<!-- Q: does awaiting a promise twice have performance drawbacks? -->
			{#await data.lazy?.subscriptions}
				...
			{:then subscriptions}
				{subscriptions.length}
			{/await}
		</Tab>
		<!-- <Tab>Annotations {data.annotations.length}</Tab> -->
	</TabList>
	<TabPanels>
		<TabPanel><EntryList items={data.items} /></TabPanel>
		<TabPanel>
			{#await data.lazy?.subscriptions}
				Loading...
			{:then subscriptions}
				{#if subscriptions}
					{#each subscriptions as item}
						<a href="/u:{$page.data.user?.username}/subscriptions/{item.feedId}">
							<ListItem>
								<div>
									<img
										class="h-6 w-6 rounded"
										src={item.feed.imageUrl ||
											`https://icon.horse/icon/${item.feed.link || new URL(item.feed.feedUrl).hostname}`}
										alt=""
									/>
								</div>
								<div class="flex"><SmallPlus>{item.title}</SmallPlus></div>
							</ListItem>
						</a>
					{/each}
				{:else}
					No annotations found
				{/if}
			{:catch error}
				{error}
			{/await}
		</TabPanel>
	</TabPanels>
</TabGroup>

<!-- <Saved annotations={data.items} /> -->
