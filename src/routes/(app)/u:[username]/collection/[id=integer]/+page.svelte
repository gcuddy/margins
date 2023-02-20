<script lang="ts">
	import Button from "$lib/components/Button.svelte";
	import TipTap from "$lib/components/TipTap.svelte";
	import type { PageData } from "./$types";

	import { enhance } from "$app/forms";
	import SmallPlus from "$lib/components/atoms/SmallPlus.svelte";
	import ChosenIcon from "$lib/components/ChosenIcon.svelte";
	import CollectionEntry from "$lib/components/CollectionEntry.svelte";
	import Icon from "$lib/components/helpers/Icon.svelte";
	import Header from "$lib/components/layout/Header.svelte";
	import DefaultHeader from "$lib/components/layout/headers/DefaultHeader.svelte";
	import dayjs from "$lib/dayjs";
	import { modals } from "$lib/stores/modals";
	import { chosenIcon } from "$lib/types/icon";
	import { Menu, MenuButton, MenuItem, MenuItems, Transition } from "@rgossiaux/svelte-headlessui";
	import Sections from "./Sections.svelte";
	import { createMutation, createQuery, useQueryClient } from "@tanstack/svelte-query";
	import { trpc } from "$lib/trpc/client";
	import type { JSONContent } from "@tiptap/core";
	import { syncStore } from "$lib/stores/sync";
	import CustomizeView from "$lib/components/CustomizeView.svelte";
	import type { ViewOptions } from "$lib/types/schemas/View";
	import EntryList from "$lib/components/EntryList.svelte";
	import type { Entry } from "@prisma/client";
	import { collectionQuery } from "$lib/features/collections/queries";
	import { page } from "$app/stores";
	import { nanoid } from "nanoid";
	export let data: PageData;
	$: console.log({ data });
	$: list = data.collection;
	$: entries = list.items
		?.filter((i) => i.entry)
		.map((i) => i.entry)
		.filter((i) => i);
	$: flattened = list.items
		?.flatMap((i) => i.entry || i.children?.flatMap((i) => i.entry) || [])
		.filter((i) => i);
	$: console.log({ flattened });
	//    $: sections = groupBy(list.items, (i) => i.section);
	$: parsed = chosenIcon.safeParse(list.icon);
	$: icon = parsed.success && parsed.data;
	// const cachedArticlesStore = writable([]);
	// // $: articles = list.items?.flatMap((i) => i.article)?.filter((i) => i) as ArticleInList[];
	// const availableArticlesToAdd = derived(cachedArticlesStore, ($articles) => {
	// 	const existingIds = articles?.map((a) => a.id) ?? [];
	// 	return $articles?.articles?.filter((a) => !existingIds.includes(a.id)) || [];
	// });

	$: favorited = data.favorites.some((f) => f.collectionId === list.id);
	$: folders = data.favorites.filter((f) => f.type === "FOLDER");

	$: console.log({ folders });

	$: console.log({ list });

	const queryClient = useQueryClient();
	// REVIEW: is this necessary?
	$: query = createQuery({ ...collectionQuery(list.id, $page), onSuccess: (data) => (list = data) });
	$: console.log({ $query });

	const addDocument = createMutation({
        mutationFn: ({
            id
        }: {
            id: string
        }) => trpc().annotations.create.mutate({
            collectionId: list.id,
            type: "document",
            id
        }),
        onMutate: async (note) => {
            // Add annotation to list, open it up
        }
    });

	const updateDescription = createMutation({
		mutationFn: async (contentData) =>
			trpc().collections.updateCollection.mutate({
				id: list.id,
				data: {
					contentData,
				},
			}),
	});
	const addSection = createMutation({
		mutationFn: (title) =>
			trpc().collections.createItem.mutate({
				type: "Section",
				collectionId: list.id,
				title,
			}),
		onMutate: async (title: string) => {
			const { queryKey } = collectionQuery(list.id);
			await queryClient.cancelQueries({
				queryKey,
			});
			const previousSnapshot = queryClient.getQueryData(queryKey);
		},
	});

	$: contentData = (list.contentData as JSONContent) || "";
	$: console.log({ contentData });

	let view: ViewOptions["view"] = "list";


</script>

<!-- <pre>
  {JSON.stringify(list, null, 2)}
</pre> -->

<Header>
	<DefaultHeader>
		<div slot="start" class="flex items-center gap-4">
			<!-- <Icon name="viewGrid" className="h-5 w-5 stroke-2 dark:stroke-gray-400" /> -->
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
				{#if icon}
					<ChosenIcon chosenIcon={icon} />
				{/if}
				<SmallPlus>{list.name}</SmallPlus>
			</button>
			<Menu class="relative">
				<form action="?/favorite" method="post" use:enhance>
					<input type="hidden" name="sortOrder" value={(data.favorites[0]?.sortOrder ?? 0) - 1} />
					<!-- on:click={(e) => e.preventDefault()} -->
					<button type="submit" class="relative flex cursor-default items-center">
						<Icon name="star" className="h-4 w-4 stroke-current {favorited ? 'fill-amber-400' : ''}" />
					</button>
					<MenuButton type="submit" class="relative flex cursor-default items-center">
						<Icon name="star" className="h-4 w-4 stroke-current {favorited ? 'fill-amber-400' : ''}" />
					</MenuButton>
				</form>
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
			</Menu>
		</div>
		<div slot="end">
			<CustomizeView on:view={({ detail }) => (view = detail)} />
		</div>
	</DefaultHeader>
</Header>

<!-- secondary header -> should this go in sidebar like reading sidebar/project sidebar for linear? in header / inline like letterboxd? -->
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

	<Button on:click={() => $addDocument.mutate({
        id: nanoid(),
    })} variant="ghost">
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
		{:else if view === "kanban"}
			<EntryList
				items={flattened}
				viewOptions={{
					view: "kanban",
				}}
			/>
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
