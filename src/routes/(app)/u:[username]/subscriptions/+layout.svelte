<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import FeedEntry from "$lib/components/FeedEntry.svelte";
	import Filter from "$lib/components/Filters/Filter.svelte";
	import FiltersList from "$lib/components/Filters/FiltersList.svelte";
	import SearchInput from "$lib/components/Filters/SearchInput.svelte";
	import type { ChildOption } from "$lib/components/Filters/SimpleFilter.svelte";
	import SubscriptionOperations from "$lib/components/SubscriptionOperations.svelte";
	import Button from "$lib/components/ui/Button.svelte";
	import { Dialog, DialogContent } from "$lib/components/ui/dialog";
	import { Tabs, TabsList, TabsTrigger } from "$lib/components/ui/tabs";
	import H1 from "$lib/components/ui/typography/H1.svelte";
	import type { RouterOutputs } from "$lib/trpc/router";
	import { Plus } from "lucide-svelte";
	import { setContext } from "svelte";
	import { writable } from "svelte/store";
	import type { LayoutData } from "./$types";
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
	<div class="flex h-full grow flex-col px-4 py-6 sm:px-6 md:px-8">
		{#if filteredItems}
			<div>
				<SearchInput
					value={searchTerm}
					on:active={({ detail: active }) => disableAnimation.set(active)}
				/>
			</div>
			{#if _filters.length}
				<div class="p-3">
					<FiltersList {filters} options={filterOptions} />
				</div>
			{/if}
		{/if}
		<!-- <H2>Your subscriptions</H2> -->
		<Tabs
			data-sveltekit-keepfocus
			on:change={(e) => {
				let index = e.detail;
				const slug = ["all", "podcasts"].at(index);
				goto(`/u:${$page.data.user?.username}/subscriptions/${slug}`);
			}}
			defaultIndex={$page.url.pathname.endsWith("all") ? 0 : 1}
		>
			<div class="flex items-center justify-between">
				{#if $page.url.pathname.endsWith("all") || $page.url.pathname.endsWith("podcasts")}
					<TabsList>
						<TabsTrigger
							as="a"
							href="/u:{$page.data?.user?.username}/subscriptions/all"
							>All</TabsTrigger
						>
						<TabsTrigger
							as="a"
							href="/u:{$page.data?.user?.username}/subscriptions/podcasts"
							>Podcasts</TabsTrigger
						>
					</TabsList>
				{:else if $page.data.title}
					<div class="flex items-center gap-6">
						<H1>{$page.data.title}</H1>
						{#if $page.data.subscription}
							<SubscriptionOperations subscription={$page.data.subscription} />
						{/if}
					</div>
				{/if}
				<Dialog>
					<svelte:fragment slot="trigger">
						<!-- variant="ghost"
						size="sm" -->
						<Button
							size="sm"
							variant="secondary"
							href="/u:{$page.params.username}/subscriptions/new"
						>
							<Plus class="mr-2 h-4 w-4" />
							<span>Add Subscription</span></Button
						>
					</svelte:fragment>
					<DialogContent let:close>
						<!-- <DialogHeader /> -->
						<FeedEntry {close} />
					</DialogContent>
				</Dialog>
			</div>
			<div class="mt-2" slot="panels">
				<slot />
				<!-- <TabsContent><slot /></TabsContent> -->
				<!-- <TabsContent><slot /></TabsContent> -->
			</div>
		</Tabs>
	</div>
</Filter>
<!-- <Dialog open={modal}>
	<FeedModal />
</Dialog> -->
