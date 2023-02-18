<script lang="ts">
	import { page } from "$app/stores";
	import autoanimate from "$lib/actions/autoanimate";
	import Icon from "$lib/components/helpers/Icon.svelte";
	import { trpc } from "$lib/trpc/client";
	import type { RouterInputs, RouterOutputs } from "$lib/trpc/router";
	import autoAnimate from "@formkit/auto-animate";
	import { createMutation } from "@tanstack/svelte-query";
	import { nanoid } from "nanoid";
	import { dndzone, overrideItemIdKeyNameBeforeInitialisingDndZones, setDebugMode } from "svelte-dnd-action";
	import SidebarFavorite from "./SidebarFavorite.svelte";
	import SidebarFavoriteFolder from "./SidebarFavoriteFolder.svelte";
	import SidebarItem from "./SidebarItem.svelte";
	export let favorites: RouterOutputs["favorites"]["list"];

	// filter favorites that have entry, smartlist, collecton, tag, or folder
	// (should be done servers side)
	// $: favorites = favorites.filter((item) => {
	// 	return !!item.entry || !!item.smartList || !!item.collection || !!item.tag || !!item.folderName;
	// });

	// setDebugMode(true);

	// trpcWithQuery().favorites.update.useMutation({

	// });
	const mutation = createMutation({
		mutationKey: ["favorites", "reorder"],
		mutationFn: (input: RouterInputs["favorites"]["update"]) => trpc().favorites.update.mutate(input),
	});

	$: console.log({ favorites });

	const newFolderFn = () => ({
		id: nanoid(),
		type: "FOLDER",
		folderName: "",
		sortOrder: (favorites[0]?.sortOrder ?? 0) - 1,
	});

	let newFolder = newFolderFn();
	let pendingFolder = false;
	let dragDisabled = false;
	$: if (pendingFolder) {
		dragDisabled = true;
		newFolder = newFolderFn();
	} else {
		dragDisabled = false;
	}

	const create = createMutation({
		mutationFn: (input: RouterInputs["favorites"]["create"]) => trpc().favorites.create.mutate(input),
		onMutate: () => {
			favorites = [newFolder, ...favorites];
		},
	});

	// use mutation
</script>

<section class="space-y-1e flex grow flex-col items-stretch px-5 text-sm">
	<div class="group flex items-center justify-between  text-gray-500">
		<span class="pl-2">Favorites</span>
		<button
			on:click={() => {
				pendingFolder = true;
				// favorites = [
				// 	{
				// 		id: nanoid(),
				// 		type: "FOLDER",
				// 		folderName: "",
				// 	},
				// 	...favorites,
				// ];
			}}
			class="flex items-center rounded-md p-1 opacity-0 transition hover:bg-gray-200 group-hover:opacity-100"
			><Icon name="folderPlusMini" className="h-4 w-4 fill-current" /></button
		>
	</div>
	<!-- REVIEW: preventing dragging beyond bounds -->
	<div
		class="flex grow flex-col items-stretch space-y-1 text-sm"
		use:autoanimate={{
			duration: 200,
			disabled: dragDisabled,
		}}
		use:dndzone={{
			items: favorites,
			flipDurationMs: 150,
			dropTargetStyle: {},
			dragDisabled,
			type: "FAVORITE",
			// morphDisabled: true,
		}}
		on:consider={(e) => {
			favorites = e.detail.items;
		}}
		on:finalize={(e) => {
			favorites = e.detail.items;
			const id = e.detail.info.id;
			const index = favorites.findIndex((favorite) => favorite.id === id);
			// get items before and after, generate sortOrder in between
			// if the index is 0, then just make sortOrder less than the next item
			// if the index is the last item, then just make sortOrder greater than the previous item
			const before = favorites[index - 1];
			const after = favorites[index + 1];
			let sortOrder = (before?.sortOrder ?? 0) + (after?.sortOrder ?? 0) / 2;
			if (index === 0) {
				console.log({ before, after });
				sortOrder = (after?.sortOrder ?? 0) - 1;
			}
			if (index === favorites.length - 1) {
				sortOrder = Math.max((before?.sortOrder ?? 0) * 2, 1);
			}
			console.log({
				id,
				sortOrder,
			});
			$mutation.mutate({
				id,
				sortOrder,
			});
		}}
	>
		{#if pendingFolder}
			<input
				autofocus
				on:blur={() => {
					if (newFolder.folderName) {
						$create.mutate(newFolder);
					}
					pendingFolder = false;
				}}
				type="text"
				bind:value={newFolder.folderName}
			/>
		{/if}
		{#each favorites as favorite (favorite.id)}
			<!-- {favorite.id}
			{favorite.type} -->
			{#if favorite.type === "FOLDER"}
				<SidebarFavoriteFolder bind:expanding={dragDisabled} {favorite} />
				<!-- <SidebarItem display={favorite.folderName || ""} icon="folder" /> -->
				<!-- folder
				{favorite.folderName} -->
			{:else}
				<SidebarFavorite {favorite} />
			{/if}
		{/each}
	</div>
</section>
