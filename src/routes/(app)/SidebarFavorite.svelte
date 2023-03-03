<script lang="ts">
	import { page } from "$app/stores";
	import AddForm from "$lib/components/AddForm.svelte";
	import { commandPaletteStore } from "$lib/components/CommandPalette/store";
	import DotMenu from "$lib/components/DotMenu.svelte";
	import type { IconName } from "$lib/icons";
	import { trpc } from "$lib/trpc/client";
	import type { RouterInputs, RouterOutputs } from "$lib/trpc/router";
	import { createMutation, useQueryClient } from "@tanstack/svelte-query";
	import type { ComponentProps } from "svelte";
	import { match, P } from "ts-pattern";
	import { favoritesQuery } from "./Sidebar.svelte";
	import SidebarItem from "./SidebarItem.svelte";

	export let favorite: RouterOutputs["favorites"]["list"][number];

	const queryClient = useQueryClient();
	async function updateFavorite(input: RouterInputs["favorites"]["update"]) {
		return trpc().favorites.update.mutate(input);
	}
	const moveToFolderMutation = createMutation({
		mutationFn: updateFavorite,
		onSuccess: (data) => {
			queryClient.invalidateQueries({
				queryKey: favoritesQuery().queryKey,
			});
		},
	});

	const itemReducer = (f: typeof favorite) =>
		match<typeof favorite, ComponentProps<SidebarItem>>(f)
			.with({ entry: P.select(P.not(P.nullish)) }, ({ title, id, type }) => ({
				display: title || "[no title]",
				href: `/u:${$page.data.user?.username}/entry/${id}`,
				icon:
					type === "movie"
						? "film"
						: type === "article"
						? "newspaper"
						: type === "book"
						? "bookOpen"
						: type === "tv"
						? "tv"
						: type === "audio"
						? "playCircle"
						: type === "tweet"
						? "tweet"
						: "document",
			}))
			.with({ tag: P.select(P.not(P.nullish)) }, ({ name }) => ({
				display: name,
				href: `/u:${$page.data.user?.username}/t:${name}`,
				icon: "tag",
			}))
			.with({ feed: P.select(P.not(P.nullish)) }, ({ title, id }) => ({
				display: title || "[no title]",
				href: `/u:${$page.data.user?.username}/subscriptions/${id}`,
				icon: "rss",
			}))
			.with({ smartList: P.select(P.not(P.nullish)) }, ({ name, id, icon: chosenIcon }) => ({
				display: name,
				href: `/u:${$page.data.user?.username}/smart/${id}`,
				icon: chosenIcon ? chosenIcon : "square3Stack3d",
			}))
			.with({ collection: P.select(P.not(P.nullish)) }, ({ name, id, icon }) => ({
				display: name,
				href: `/u:${$page.data.user?.username}/collection/${id}`,
				icon: icon ? icon : "collection",
			}))
			.otherwise(() => ({
				display: "unknown",
				href: "/",
				icon: "document",
			}));
</script>

<!-- REVIEW: using chosenicon vs generic icon. Is it confusing? -->

<SidebarItem {...itemReducer(favorite)}>
	<div slot="end">
		<DotMenu
			items={[
				[
					{
						label: "Edit",
						href: `/u:{$page.data.user?.username}/collection/{favorite.collection.id}/edit`,
					},
					{
						label: "Delete",
						href: `/u:{$page.data.user?.username}/collection/{favorite.collection.id}/delete`,
					},
					{
						label: "Move to folder",
						perform: () => {
							commandPaletteStore.open({
								values: $page.data.favorites
									?.filter((t) => t.type === "FOLDER")
									.map((favorite) => {
										return {
											...favorite,
											name: favorite.folderName || "",
										};
									}),
								onSelect: ({ detail: selected }) => {
									$moveToFolderMutation.mutate({
										id: favorite.id,
										parent: selected.id.toString(),
									});
								},
							});
						},
					},
				],
			]}
		/>
	</div>
</SidebarItem>
