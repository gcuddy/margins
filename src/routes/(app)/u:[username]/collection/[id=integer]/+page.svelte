<script lang="ts">
	import { enhance } from "$app/forms";
	import { page } from "$app/stores";
	import SmallPlus from "$lib/components/atoms/SmallPlus.svelte";
	import Button from "$lib/components/Button.svelte";
	import ChosenIcon from "$lib/components/ChosenIcon.svelte";
	import CollectionEntry from "$lib/components/CollectionEntry.svelte";
	import CustomizeView from "$lib/components/CustomizeView.svelte";
	import EntryList from "$lib/components/EntryList.svelte";
	import Icon from "$lib/components/helpers/Icon.svelte";
	import Header from "$lib/components/layout/Header.svelte";
	import DefaultHeader from "$lib/components/layout/headers/DefaultHeader.svelte";
	import Tabs from "$lib/components/layout/tabs/Tabs.svelte";
	import TipTap from "$lib/components/TipTap.svelte";
	import dayjs from "$lib/dayjs";
	import AnnotationListItem from "$lib/features/annotations/AnnotationListItem.svelte";
	import { collectionQuery } from "$lib/features/collections/queries";
	import { modals } from "$lib/stores/modals";
	import { syncStore } from "$lib/stores/sync";
	import { getUserDataContext } from "$lib/stores/userdata";
	import { trpc, trpcWithQuery } from "$lib/trpc/client";
	import type { RouterInputs } from "$lib/trpc/router";
	import type { ViewOptions } from "$lib/types/schemas/View";
	import { Menu, MenuButton, MenuItem, MenuItems, Transition } from "@rgossiaux/svelte-headlessui";
	import { localStorageStore, Tab, TabGroup } from "@skeletonlabs/skeleton";
	import { createMutation, useQueryClient } from "@tanstack/svelte-query";
	import type { JSONContent } from "@tiptap/core";
	import { nanoid } from "nanoid";
	import type { PageData } from "./$types";
	import Sections from "./Sections.svelte";
	export let data: PageData;
	$: query = data.query();

	$: console.log({ data });
	$: list = $query.data;
	$: entries =
		list?.items
			?.filter((i) => i.entry)
			.map((i) => i.entry)
			.filter(Boolean) || [];
	$: flattened =
		list?.items?.flatMap((i) => i.entry || i.children?.flatMap((i) => i.entry) || []).filter(Boolean) || [];
	$: console.log({ flattened });
	let favorited = false;
    // $: favoritesQuery = client.favorites.list.createQuery();

	$: favorited = data.favorites.some((f) => f.collectionId === list?.id);
	$: folders = data.favorites.filter((f) => f.type === "FOLDER");
	const queryClient = useQueryClient();
	// REVIEW: is this necessary?

	const tabSet = localStorageStore("tabSet", "entries");

	const client = trpcWithQuery($page);
	const utils = client.createContext();
	const annotationMutation = client.annotations.create.createMutation({
		onSuccess: (data) => {
			if (!list) return;
			utils.collections.detail.invalidate({
				id: list?.id,
			});
		},
	});

	const addDocument = createMutation({
		mutationFn: ({ id }: { id: string }) =>
			trpc().annotations.create.mutate({
				collectionId: list?.id,
				type: "document",
				id,
			}),
		onMutate: async (note) => {
			// Add annotation to list, open it up
		},
	});

	const updateCollection = createMutation({
		mutationFn: (data: RouterInputs["collections"]["updateCollection"]["data"]) =>
			trpc().collections.updateCollection.mutate({
				id: list?.id,
				data,
			}),
		onSuccess: (data, vars) => {
			// invalidate entries
			console.log({ data, vars });
		},
	});
	const addSection = createMutation({
		mutationFn: (title) =>
			trpc().collections.createItem.mutate({
				type: "Section",
				collectionId: list?.id,
				title,
			}),
		onMutate: async (title: string) => {
			const { queryKey } = collectionQuery(list?.id);
			await queryClient.cancelQueries({
				queryKey,
			});
			const previousSnapshot = queryClient.getQueryData(queryKey);
		},
	});

	$: contentData = (list.contentData as JSONContent) || "";
	$: console.log({ contentData });

	let view: ViewOptions["view"];
	$: view = data.collection?.viewOptions?.view || "list";
</script>

<!-- <pre>
  {JSON.stringify(list, null, 2)}
</pre> -->

<Header>
	<DefaultHeader>
		<div slot="start" class="flex items-center gap-4">
			<!-- <Icon name="viewGrid" className="h-5 w-5 stroke-2 dark:stroke-gray-400" /> -->
			<span>
				{$page.params.username} >
			</span>
			<button
				class="flex items-center gap-2"
				on:click={() => {
					modals.open(
						CollectionEntry,
						{
							collection: list,
						},
						"collection-entry"
					);
				}}
			>
				{#if list?.icon}
					<ChosenIcon chosenIcon={list.icon} />
				{/if}
				<SmallPlus>{list.name}</SmallPlus>
			</button>
			<Menu class="relative">
				<form
					action="?/favorite"
					method="post"
					use:enhance={() => {
						favorited = true;
						return async ({ update }) => {
							await update();
							await $page.data.queryClient.invalidateQueries({
								queryKey: ["favorites"],
							});
						};
					}}
				>
					<input type="hidden" name="sortOrder" value={(data.favorites[0]?.sortOrder ?? 0) - 1} />
					<!-- on:click={(e) => e.preventDefault()} -->
					<!-- <button type="submit" class="relative flex cursor-default items-center">
						<Icon name="star" className="h-4 w-4 stroke-current {favorited ? 'fill-amber-400' : ''}" />
					</button> -->
					<MenuButton type="submit" class="relative flex cursor-default items-center">
						<Icon name="star" className="h-4 w-4 stroke-current {favorited ? 'fill-amber-400' : ''}" />
					</MenuButton>
					<Transition
						enter="transition ease-out duration-100"
						enterFrom="transform opacity-0 scale-95"
						enterTo="transform opacity-100 scale-100"
						leave="transition ease-in duration-75"
						leaveFrom="transform opacity-100 scale-100"
						leaveTo="transform opacity-0 scale-95"
					>
						<MenuItems
							class="absolute left-0 z-40 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
						>
							<div class="px-1 py-1">
								<MenuItem as="button" type="submit">Favorite</MenuItem>
								<!-- <MenuItem>Favorite</MenuItem> -->
							</div>
							{#if folders.length}
								<div class="px-1 py-1">
									{#each folders as folder}
										<MenuItem>{folder.folderName}</MenuItem>
									{/each}
								</div>
							{/if}
						</MenuItems>
					</Transition>
				</form>
			</Menu>
		</div>
		<div slot="end">
			<Tabs tabs={["List", "Grid", "Kanban"]} />
			<CustomizeView
				on:view={({ detail }) => {
					view = detail;
					// data.collection.viewOptions = {
					// 	...data.collection.viewOptions,
					// 	view,
					// };
					$updateCollection.mutate({ viewOptions: { view } });
					// save
				}}
			/>
		</div>
	</DefaultHeader>
</Header>

<!-- secary header -> should this go in sidebar like reading sidebar/project sidebar for linear? in header / inline like letterboxd? -->
{#if $query.isLoading}
	loading...
{:else if $query.isSuccess}
	{@const list = $query.data}

	<div class=" container mx-auto">
		<div class="flex flex-col gap-2 text-sm">
			<span>List by {list.userId}</span>
			<span>Updated {dayjs(list.updatedAt).fromNow()}</span>
			<span>{list.description}</span>
		</div>

		{#key contentData}
			<TipTap
				on:blur={async ({ detail: contentData }) => {
					//    $updateDescription.mutate(data)
					console.log({ contentData });
					const s = syncStore.add();
					await trpc().collections.updateCollection.mutate({
						id: list.id,
						data: {
							contentData,
						},
					});
					syncStore.remove(s);
				}}
				config={{
					content: contentData,
				}}
			/>
		{/key}

		<Button
			on:click={() =>
				$annotationMutation.mutate({
					id: nanoid(),
					collectionId: list?.id,
					type: "document",
				})}
			variant="ghost"
		>
			<Icon name="plusMini" className="h-4 w-4 fill-current" />
			<span>Add note</span></Button
		>
		<form
			action="?/addSection"
			method="post"
			on:submit={() => {
				// instead of use:enhance we'll use custom mutation
			}}
			class="flex justify-end px-4"
		>
			<input type="hidden" name="title" value="Untitled" />
			<Button type="submit" variant="ghost">
				<Icon name="plusMini" className="h-4 w-4 fill-current" />
				<span>Add section</span></Button
			>
		</form>

		<div class=" flex grow flex-col items-stretch">
			<!-- REVIEW: this is probably a terrible way to do it, but only list mode allows sections? -->
			{#if view === "list"}
				<Sections
					items={list.items}
					onFinalUpdate={(n) => {
						console.log({ n });
						// ((data.collection.items = n));
					}}
				/>
			{:else if view === "grid"}
				<!--multi list grid  -->
				Divide by section...
				<Sections
					{view}
					items={list.items}
					onFinalUpdate={(n) => {
						console.log({ n });
						// ((data.collection.items = n));
					}}
				/>
			{:else if view === "kanban"}
				<div class="flex flex-col space-y-2">
					<div class="max-w-max overflow-hidden rounded-lg bg-elevation text-sm text-muted">
						<TabGroup border="" hover="hover:text-bright" active="bg-elevation-hover">
							<Tab bind:group={$tabSet} value="entries" name="entries">Entries</Tab>
							<Tab bind:group={$tabSet} value="annotations" name="annotations">Notes</Tab>
						</TabGroup>
					</div>
					{#if $tabSet === "entries"}
						<EntryList
							on:kanbandrop={async (e) => {
								// TODO: invalidate queries
							}}
							items={flattened}
							viewOptions={{
								view: "kanban",
							}}
						/>
					{:else if $tabSet === "annotations"}
						<!-- TODO: nested -->
						{#each list.items as item}
							{#if item.annotation}
								<AnnotationListItem annotation={item.annotation} />
							{/if}
						{/each}
						<!-- loop through annota    tions -->
					{/if}
				</div>
			{/if}

			<!-- {#each list.items as item (item.id)}

		<div class="border">
			{#if item.type === "Section"}
				<GenericInput on:blur={(e) => {
                    const value = e.target?.value;
                    trpc().collections.updateItem.mutate({
                        id: item.id,
                        data: {
                            title: value
                        }
                    })
                }} value={item.title || "Untitled"} variant="naked"  class=" inline-block text-xl">{item.title || "Untitled Section"}</GenericInput>
                {#if item.children.length}
                    {@const entries = item.children.flatMap(c => c.entry).filter(e => e)}
                    <EntryList items={entries} />
            {:else}
                <div class="h-16 border-dashed w-full bg-red-400 w-10"></div>
                {/if}
			{:else if item.entry}
				<EntryListItem entry={item.entry} />
			{/if}
		</div>
	{/each} -->
		</div>
	</div>
{/if}
