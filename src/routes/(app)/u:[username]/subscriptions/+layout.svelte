<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import Filter from "$lib/components/Filters/Filter.svelte";
	import FiltersList from "$lib/components/Filters/FiltersList.svelte";
	import SearchInput from "$lib/components/Filters/SearchInput.svelte";
	import type { ChildOption } from "$lib/components/Filters/SimpleFilter.svelte";
	import { Tabs, TabsList, TabsTrigger } from "$lib/components/ui/tabs";
	import type { RouterOutputs } from "$lib/trpc/router";
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

	const routes = [
		"/(app)/u:[username]/subscriptions/all",
		"/(app)/u:[username]/subscriptions/podcasts",
	];
	$: currentIndex = routes.indexOf($page.route.id);
</script>

<Filter
	searchKeys={["title"]}
	values={entries || []}
	let:searchTerm
	let:filters
	let:filteredItems
	let:_filters
>
	<!-- <Header>
		<DefaultHeader>
			<div slot="start" class="flex items-center gap-2">
				{#if $page.data.subscription}
					<FeedTitleMenu subscription={$page.data.subscription} />
				{:else}
					<div>
						<SmallPlus>{$page.data.title || "Subscriptions"}</SmallPlus>
					</div>
				{/if}
				{#if $page.data.entries}
					<div>
						{#if !_filters.length}
							<FilterDisplay {filters} options={filterOptions} />
						{:else}
							<Button
								variant="dashed"
								className="space-x-1 text-sm"
								on:click={() => filters.reset()}
							>
								<Icon name="xMarkMini" className="h-4 w-4 dark:fill-gray-300" />
								<span>Clear Filters</span>
							</Button>
						{/if}
					</div>
				{/if}
			</div>
			<div class="flex gap-2" slot="end">
				<Dialog>
					<svelte:fragment slot="trigger">
						<Button
							variant="ghost"
							size="sm"
							href="/u:{$page.params.username}/subscriptions/new"
						>
							<Icon name="plusSmall" className="h-5 w-5 fill-current" />
							<span>Add Subscription</span></Button
						>
					</svelte:fragment>
					<DialogContent let:close>
						<DialogHeader>
						</DialogHeader>
						<FeedEntry {close} />
					</DialogContent>
				</Dialog>
			</div>
		</DefaultHeader>
	</Header> -->
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
		<Tabs
			data-sveltekit-keepfocus
			on:change={(e) => {
				let index = e.detail;
				const slug = ["all", "podcasts"].at(index);
				goto(`/u:${$page.data.user?.username}/subscriptions/${slug}`);
			}}
			defaultIndex={currentIndex}
		>
			<TabsList>
				<TabsTrigger
					as="a"
					href="/u:{$page.data.user?.username}/subscriptions/all"
					>All</TabsTrigger
				>
				<TabsTrigger
					as="a"
					href="/u:{$page.data.user?.username}/subscriptions/podcasts"
					>Podcasts</TabsTrigger
				>
			</TabsList>
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
