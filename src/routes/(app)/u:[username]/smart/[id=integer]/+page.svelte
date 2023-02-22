<script lang="ts" context="module">
	export const filterQuery = (filter: Prisma.JsonValue, init?: TRPCClientInit) =>
		({
			queryKey: ["entries", "filter", filter],
			queryFn: async () =>
				trpc(init).entries.filter.query({
					where: filter,
				}),
			keepPreviousData: true,
		} satisfies CreateQueryOptions);
</script>

<script lang="ts">
	import { enhance } from "$app/forms";
	import { goto } from "$app/navigation";

	import { page } from "$app/stores";
	import SmallPlus from "$lib/components/atoms/SmallPlus.svelte";
	import Button from "$lib/components/Button.svelte";
	import ChosenIcon from "$lib/components/ChosenIcon.svelte";
	import ContextMenu from "$lib/components/ContextMenu.svelte";
	import CustomizeView from "$lib/components/CustomizeView.svelte";
	import EntryList from "$lib/components/EntryList.svelte";
	import FavoriteStar from "$lib/components/FavoriteStar.svelte";
	import Icon from "$lib/components/helpers/Icon.svelte";

	import Header from "$lib/components/layout/Header.svelte";
	import DefaultHeader from "$lib/components/layout/headers/DefaultHeader.svelte";
	import SmartListEntry from "$lib/components/SmartListEntry.svelte";
	import { modals } from "$lib/stores/modals";
	import { notifications } from "$lib/stores/notifications";
	import { syncStore } from "$lib/stores/sync";
	import { trpc } from "$lib/trpc/client";
	import type { RouterOutputs } from "$lib/trpc/router";
	import { ViewOptionsSchema, type ViewOptions } from "$lib/types/schemas/View";
	import type { Prisma } from "@prisma/client";
	import { createQuery, CreateQueryOptions } from "@tanstack/svelte-query";
	import { nanoid } from "nanoid";
	import type { TRPCClientInit } from "trpc-sveltekit";
	import type { PageData } from "./$types";

	export let data: PageData;
	$: ({ list } = data);
	let viewOptions: ViewOptions | undefined;
	if (list) {
		const savedViewOptions = ViewOptionsSchema.safeParse(list.viewOptions);
		if (savedViewOptions.success) {
			viewOptions = savedViewOptions.data;
		}
	}
	$: query = createQuery(filterQuery(data.list.filter, $page));

	let favorited = false;
	$: favorited = data.favorites.some((favorite) => favorite.smartList?.id === list.id);

	// let sortedArticles = [...articles];
	// $: if (viewOptions) sortedArticles = sortArticles(articles, viewOptions);
	// $: console.log({ sortedArticles });
</script>

<svelte:head>
	<title>{list.name}</title>
</svelte:head>

<Header>
	<DefaultHeader>
		<div slot="start" class="flex items-center space-x-2">
			<!-- <Icon name="collectionSolid" /> -->
            <ContextMenu items={[[
                {
                    href: `${$page.url.pathname}/edit`,
                    label: "Edit"
                }
            ]]}>
				<ChosenIcon chosenIcon={list.icon} />
				<SmallPlus size="base">{list.name}</SmallPlus>
            </ContextMenu>
			<!-- <button
				class="flex items-center gap-2"
				on:click={() => {
                    goto(`/${$page.url.pathname}/edit`)
					// modals.open(
					// 	SmartListEntry,
					// 	{
					// 		view: list,
					// 	},
					// 	"view-entry"
					// );
				}}
			>
				<ChosenIcon chosenIcon={list.icon} />
				<SmallPlus size="base">{list.name}</SmallPlus>
			</button> -->
			<form
				action="?/favorite"
				method="post"
				use:enhance={() => {
					//optimistic
					favorited = true;
					return async ({ update, result }) => {
						console.log({ result });
						if (result.type === "error") {
							// roll back
							update();
						}
						if (result.type === "success") {
							data.queryClient.setQueryData(["favorites"], (favorites) => {
								// REVIEW: fix types here
								if (favorites) {
									return [result.data, ...favorites];
								}
								return favorites;
							});
						}
						// update();
						// data.queryClient.setQueryData<RouterOutputs["favorites"]["list"]>(["favorites"], favorites => {
						// 	return result.data.favorite
						// })
					};
				}}
			>
				<input type="hidden" name="sortOrder" value={(data.favorites[0]?.sortOrder ?? 0) - 1} />
				<Button type="submit" variant="naked">
					<Icon name="star" className="h-4 w-4 stroke-gray-500 {favorited ? 'fill-amber-400' : ''}" />
				</Button>
			</form>
			<!-- <FavoriteStar
				starred={!!list.favorite}
				data={{
					smartListId: list.id,
				}}
			/> -->
		</div>
		<div slot="end">
			<CustomizeView
				bind:viewOptions
				on:save={async () => {
					const syncId = syncStore.add();
					const res = await fetch(`/smart/${list.id}`, {
						method: "PATCH",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							viewOptions,
						}),
					});
					if (res.ok) {
						syncStore.remove(syncId);
						notifications.notify({
							message: "View options saved",
							type: "success",
						});
					}
				}}
			/>
		</div>
	</DefaultHeader>
</Header>

{#if $query.isLoading}
	loading
{:else if $query.isSuccess && $query.data}
	<EntryList items={$query.data} />
{/if}

<!-- {#if articles.length}
	<Saved
		annotations={sortedArticles || articles}
		actions={{
			addToList: true,
		}}
		{viewOptions}
	/>
{:else}{/if} -->
<!-- TODO: make work progressively enhanced with actual forms -->

<!-- <div class="flex max-w-md flex-col ">
	<span>
		If
		<Select block={false} bind:value={and}>
			<option value="AND">Any</option>
			<option value="OR">All</option>
			<option value="NOT">None</option>
		</Select>
		of the following conditions are met
	</span>
	<Button on:click={newCondition} variant="ghost">New Condition</Button>
	{#each conditions as condition, index (condition.id)}
		<label for="condition-{index}" class="flex items-center">
			<Select bind:value={condition.field}>
				<option value="author">Author</option>
				<option value="title">Title</option>
				<option value="url">URL</option>
			</Select>
		</label>
		<Select name="{condition.field}-filter" bind:value={condition.filter}>
			<option value="contains">Contains</option>
			<option value="equals">Is</option>
		</Select>
		<GenericInput id="condition-{index}" name={condition.field} bind:value={condition.value} />
	{/each}

	<pre>
    {JSON.stringify(json, null, 2)}
  </pre>
	{#if current_results.length}
		<Saved articles={current_results} />
	{/if}
</div> -->
