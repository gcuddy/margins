<script lang="ts">
	import { goto, invalidate, invalidateAll } from "$app/navigation";
	import { page } from "$app/stores";
	import {
		commandStore,
		filteredActions,
		selected,
		selectedCommand,
		showCommandPalette,
		term,
	} from "$lib/stores/commands";
	import {
		checkIfKeyboardShortcutsAllowed,
		disableGlobalKeyboardShortcuts,
	} from "$lib/stores/keyboard";
	import { animationHappening, modals } from "$lib/stores/modals";
	import { notifications } from "$lib/stores/notifications";
	import { selectedItems } from "$lib/stores/selectedItems";
	import { syncStore } from "$lib/stores/sync";
	import { fadeScale } from "$lib/transitions";
	import { trpc, trpcWithQuery } from "$lib/trpc/client";
	import { LOCATION_TO_ICON_SOLID } from "$lib/types/schemas/Locations";
	import {
		listPodcastsQuery,
		podcastSearchQuery,
	} from "$lib/features/podcasts/queries";
	import { getUser } from "@lucia-auth/sveltekit/client";
	import { tweened } from "svelte/motion";
	import { get } from "svelte/store";
	import { fade } from "svelte/transition";
	import Combobox from "../helpers/Combobox.svelte";
	import Dialog from "../helpers/dialog/Dialog.svelte";
	import DialogOverlay from "../helpers/dialog/DialogOverlay.svelte";
	import Icon from "../helpers/Icon.svelte";
	import KbdGroup from "../kbd/KbdGroup.svelte";
	import TagModal from "../TagModal.svelte";
	import Selection from "./Selection.svelte";
	import { commandPaletteStore } from "./store";
	import type { Command } from "./types";
	import SearchItem from "$lib/features/podcasts/SearchItem.svelte";
	import { listCollectionsQuery } from "$lib/features/collections/queries";
	import { createMutation, useQueryClient } from "@tanstack/svelte-query";
	import { listSubscriptionsQuery } from "$lib/features/subscriptions/queries";
	import { allowedThemes, darkThemes } from "$lib/features/settings/themes";
	import {
		getEntriesFromCache,
		listEntriesQuery,
		showEntrySelector,
	} from "$lib/features/entries/queries";
	import type { Entry } from "@prisma/client";
	import EntryListItem from "$lib/features/entries/EntryListItem.svelte";
	import type { RouterInputs, RouterOutputs } from "$lib/trpc/router";
	import { searchBookQuery } from "$lib/features/books/queries";
	import RichAnnotationInput from "../annotations/RichAnnotationInput.svelte";
	import { useSaveAnnotation } from "$lib/features/annotations/mutations";
	import { useCreateBookmark } from "$lib/features/entries/mutations";
	import BasicSearchItem from "$lib/features/entries/BasicSearchItem.svelte";

	const queryClient = useQueryClient();
	const client = trpcWithQuery($page);
	const utils = client.createContext();
	const user = getUser();

	const saveAnnotationMutation = useSaveAnnotation();

	const createBookmarkMutation = useCreateBookmark();

	function handleKeydown(e: KeyboardEvent) {
		switch (e.key) {
			case "ArrowDown": {
				selected.inc($filteredActions.length - 1);
				break;
			}
			case "ArrowUp": {
				selected.dec();
				break;
			}
			case "Enter": {
				e.preventDefault();
				$selectedCommand.perform({ page: $page });
				showCommandPalette.out();
			}
		}
	}

	const updateMutation = client.bookmarks.update.createMutation({
		onMutate: ({ id, entryId, data }) => {
			// TODO: set data
			// TODO: type location?
			console.log({ id, data, $page, entryId });
			if (data.stateId && $page.data.location && entryId && $page.data.user) {
				// update current lists
				const newLocation = $page.data.user.stateIdToLocation.get(
					data.stateId as number
				);
				const newStateName = $page.data.user.stateIdToName.get(
					data.stateId as number
				);
				const entriesToMove: RouterOutputs["entries"]["listBookmarks"] = [];
				utils.entries.listBookmarks.setData(
					{
						location: $page.data.location,
					},
					(old) => {
						console.log({ old });
						if (!old) return old;
						if (!$page.data.user) return old;
						let updated = false;

						const updatedEntries = old.map((entry) => {
							if (
								Array.isArray(entryId)
									? entryId.includes(entry.id)
									: entry.id === entryId
							) {
								console.log({ entry });
								updated = true;
								entriesToMove.push(entry);
								return {
									...entry,
									bookmarks: [
										{
											...entry.bookmarks[0],
											...data,
										},
									],
								};
							}
							return entry;
						});
						if (entriesToMove.length) {
							if (data.stateId && $page.data.user) {
								if (entriesToMove.length === 1) {
									notifications.notify({
										title: `${entriesToMove[0].title} moved to ${newStateName}`,
										// message: `Updated bookmark for ${entry.title}`,
										type: "info",
									});
								} else {
									notifications.notify({
										title: `Moved ${entriesToMove.length} bookmarks to ${newStateName}`,
										type: "info",
										timeout: 3000,
									});
								}
							}
						}
						if (updated) selectedItems.set([]);
						return updatedEntries;
					}
				);
				console.log({ newLocation, entriesToMove, $page });
				if (newLocation && newLocation !== $page.data.location) {
					utils.entries.listBookmarks.setData(
						{
							location: newLocation,
						},
						(old) => {
							if (!old) return old;
							const updated = [...old, ...entriesToMove];
							console.log({ updated });
							return updated;
						}
					);
				}
			}
		},
		onSuccess: async () => {
			await utils.entries.invalidate();
			selectedItems.set([]);
		},
	});

	const createRelation = client.entries.createRelation.createMutation({
		onSuccess: async (data) => {
			notifications.notify({
				title: `Relation${
					Array.isArray(data) && data.length ? "s" : ""
				} created`,
				type: "info",
			});
			utils.entries.invalidate();
			selectedItems.set([]);
		},
	});

	const updateBookmarkMutation = createMutation({
		mutationFn: ({ id, entryId, data }: RouterInputs["bookmarks"]["update"]) =>
			trpc($page).bookmarks.update.mutate({
				id,
				entryId,
				data,
			}),
		onMutate: async ({ id, data, entryId }) => {
			// TODO: setqueriesdaa
			queryClient.setQueriesData<RouterOutputs["entries"]["listBookmarks"]>(
				["entries"],
				(old) => {
					if (!old || !Array.isArray(old)) return old;
					console.log({ old, id, data, entryId });
					const newEntries = old.map((entry) => {
						if (
							Array.isArray(entryId)
								? entryId.includes(entry.id)
								: entry.id === entryId
						) {
							console.log("entry hit", entry);
							if (entry.bookmarks) {
								entry.bookmarks[0] = {
									...entry.bookmarks[0],
									...data,
								};
								console.log({ entry });
								return entry;
							}
						}
						return entry;
					});
					return newEntries;
				}
			);
			invalidate("entries");
		},
		onSuccess: async (data) => {
			await queryClient.invalidateQueries({
				queryKey: ["entries"],
			});
			await queryClient.invalidateQueries({
				queryKey: ["bookmarks"],
			});
			selectedItems.set([]);
			// REVIEW: do we need notification here?
			// TODO: describe what  was updated
			if ("count" in data) {
				notifications.notify({
					message: `Updated ${data.count} bookmarks`,
					type: "success",
				});
			} else {
				notifications.notify({
					message: `Updated bookmark`,
					type: "success",
				});
			}
		},
	});

	function commandListener(e: KeyboardEvent) {
		if (e.metaKey && e.key === "k") {
			e.preventDefault();
			showCommandPalette.toggle();
		}
		if (e.key === "Escape") {
			showCommandPalette.out();
		}
	}
	function handleTouch(e: TouchEvent) {
		if (e.touches.length === 2) {
			e.preventDefault();
			setTimeout(() => {
				if (!checkIfKeyboardShortcutsAllowed()) return;
				if ($modals.length) return;
				showCommandPalette.toggle();
			}, 100);
		}
	}
	// $: $term, selected.reset();
	let currentGroup: string;

	$: console.log({ $showCommandPalette });

	$: $showCommandPalette,
		$showCommandPalette
			? disableGlobalKeyboardShortcuts.on()
			: disableGlobalKeyboardShortcuts.off();

	let dialogRef: HTMLElement;

	// these are commands that depend on being in a svelte component
	const jump_commands: Command[] = [
		{
			id: "jump-to-collection",
			group: "jump",
			name: "Jump to collection",
			icon: "collection",
			perform: async () => {
				showCommandPalette.out();
				const existingCollections =
					await $page.data.queryClient.ensureQueryData(listCollectionsQuery());
				commandPaletteStore.open({
					values: existingCollections,
					onSelect: async ({ detail }) => {
						await goto(`/u:${$user?.username}/collection/${detail.id}`);
					},
				});
			},
		},
		{
			id: "jump-to-board-game",
			group: "jump",
			name: "Jump to board game",
			icon: "arrowRight",
			perform: async () => {
				showCommandPalette.out();
				commandPaletteStore.open({
					queryResult: (search) =>
						client.public.boardgames.createQuery(
							{
								search,
							},
							{
								enabled: search.length > 2,
							}
						),
					slot: ({ value, active, selected }) => ({
						component: BasicSearchItem,
						props: {
							href: `/boardgames/${value.id}`,
							image: value.image_url,
							title: value.name,
							year: value.year_published,
							active,
						},
					}),
					onSelect: async ({ detail }) => {
						await goto(`/bgames/${detail.id}`);
					},
					debounce: 200,
					placeholder: "Search board games…",
				});
			},
		},
		{
			id: "jump-to-game",
			group: "jump",
			name: "Jump to game",
			icon: "arrowRight",
			perform: async () => {
				showCommandPalette.out();
				commandPaletteStore.open({
					queryResult: (search) =>
						client.public.games.createQuery(
							{
								search,
							},
							{
								enabled: search.length > 2,
							}
						),
					slot: ({ value, active, selected }) => ({
						component: BasicSearchItem,
						props: {
							href: `/games/${value.id}`,
							image: value.cover.url,
							title: value.name,
							year: value.first_release_date,
							active,
						},
					}),
					onSelect: async ({ detail }) => {
						await goto(`/games/${detail.id}`);
					},
					debounce: 200,
					placeholder: "Search games…",
				});
			},
		},
		{
			id: "jump-to-podcast",
			group: "jump",
			name: "Jump to podcast",
			perform: async () => {
				showCommandPalette.out();
				const existingPodcasts = [];
				// const existingPodcasts = await $page.data.queryClient.ensureQueryData(listPodcastsQuery());
				commandPaletteStore.open({
					query: (v) => {
						// TODO: massage results by bumping saved podcasts to the top
						const filteredPodcasts = existingPodcasts.filter((p) =>
							p.title?.toLowerCase().includes(v.toLowerCase())
						);
						const q = podcastSearchQuery($page, v);
						// REVIEW: ideally we wouldn't have to type this
						return {
							...q,
							placeholderData: filteredPodcasts,
							enabled: v.length > 2,
							select: (data: ApiResponse.Search) => {
								// REVIEW: this is probably to expensive to do on every keypress
								// TODO: initally jump in with existing podcasts, and use simple includes
								const sortedFeeds = data.feeds?.sort((a, b) => {
									const aSaved = existingPodcasts.some(
										(p) => p.podcastIndexId === a.id
									);
									const bSaved = existingPodcasts.some(
										(p) => p.podcastIndexId === b.id
									);
									if (aSaved && !bSaved) return -1;
									if (!aSaved && bSaved) return 1;
									return 0;
								});
								return sortedFeeds;
							},
						};
					},
					debounce: 150,
					slot: () => ({ component: SearchItem }),
					onSelect: async ({ detail }) => {
						await goto(`/podcasts/${detail.id}`);
					},
				});
			},
			icon: "arrowRight",
			kbd: [["j", "p"]],
		},
		{
			id: "jump-to-book",
			group: "jump",
			name: "Jump to book",
			perform: async () => {
				showCommandPalette.out();
				// const existingBooks = await queryClient.ensureQueryData(
				// 	listEntriesQuery({
				// 		type: "book",
				// 	})
				// );
				commandPaletteStore.open({
					query: (v) => {
						// const filteredBooks = existingBooks.filter((p) =>
						// 	p.title?.toLowerCase().includes(v.toLowerCase())
						// );
						const q = searchBookQuery($page, v);
						// REVIEW: ideally we wouldn't have to type this
						return {
							...q,
							select: (data) => data.items,
							// placeholderData: filteredBooks,
							// select: (data: RouterOutputs["books"]["public"]["search"]) => {
							// 	// group filtered books, then search results
							//     return [...filteredBooks, ...data.items];
							// },
						};
					},
					slot: ({ value, active }) => ({
						component: EntryListItem,
						props: {
							entry: {
								image: value.volumeInfo?.imageLinks?.thumbnail,
								title: value.volumeInfo?.title,
								author: value.volumeInfo?.authors?.join(", "),
								published: value.volumeInfo?.publishedDate,
							},
							active,
						},
					}),
					onSelect: async ({ detail }) => {
						await goto(`/books/${detail.id}`);
					},
				});
			},
			icon: "arrowRight",
			kbd: [["j", "p"]],
		},
		{
			id: "jump-to-entry",
			group: "jump",
			name: "Jump to entry",
			perform: () => {
				console.log("queryData", queryClient.getQueryData(["entries"]));
				const cachedEntries = getEntriesFromCache(queryClient);
				// const query =
				// TODO: group into recent
				console.log({ cachedEntries });
				showCommandPalette.out();
				// grab entries from queryclient, search for rest
				commandPaletteStore.open<Entry>({
					// values: cachedEntries,
					query: (value) => ({
						queryKey: ["entries", "search", value],
						keepPreviousData: true,
						queryFn: async () =>
							trpc().entries.search.query({
								query: value,
								title: true,
								author: true,
								text: false,
							}),
						placeholderData: cachedEntries.filter((e) => {
							return (
								e.title?.toLowerCase().includes(value.toLowerCase()) ||
								e.author?.toLowerCase().includes(value.toLowerCase())
							);
						}),
						select: (data) => {
							// keep placeholder data at the top, but de-dupe by id
							const filteredCachedEntries = cachedEntries.filter(
								(e) =>
									e.title?.toLowerCase().includes(value.toLowerCase()) ||
									e.author?.toLowerCase().includes(value.toLowerCase())
							);
							const deduped = [...filteredCachedEntries, ...data].reduce(
								(acc, cur) => {
									if (!acc.some((e) => e.id === cur.id)) {
										acc.push(cur);
									}
									return acc;
								},
								[] as Entry[]
							);
							console.log({ deduped });
							return deduped;
						},
						enabled: value.length > 2,
						// enabled: value.length > 2,
					}),
					slot: ({ value, active }) => ({
						component: EntryListItem,
						props: {
							entry: value,
							active,
						},
					}),
					onSelect: async (entry) => {
						await goto(`/u:${$user?.username}/entry/${entry.detail.id}`);
					},
				});
				// jumpToArticle();
			},
			icon: "arrowRight",
			kbd: [["o", "a"]],
		},
		{
			id: "jump-to-note",
			group: "jump",
			name: "Jump to note",
			perform: () => {
				commandPaletteStore.open<Entry>({
					// values: cachedEntries,
					query: (value) => ({
						queryKey: ["entries", "search", value],
						keepPreviousData: true,
						queryFn: async () =>
							trpc().annotations.search.query({
								query: value,
								title: true,
								author: true,
								text: false,
							}),
						select: (data) => {
							// keep placeholder data at the top, but de-dupe by id
							const filteredCachedEntries = cachedEntries.filter(
								(e) =>
									e.title?.toLowerCase().includes(value.toLowerCase()) ||
									e.author?.toLowerCase().includes(value.toLowerCase())
							);
							const deduped = [...filteredCachedEntries, ...data].reduce(
								(acc, cur) => {
									if (!acc.some((e) => e.id === cur.id)) {
										acc.push(cur);
									}
									return acc;
								},
								[] as Entry[]
							);
							console.log({ deduped });
							return deduped;
						},
						enabled: value.length > 2,
						// enabled: value.length > 2,
					}),
					slot: ({ value, active }) => ({
						component: EntryListItem,
						props: {
							entry: value,
							active,
						},
					}),
					onSelect: async (entry) => {
						await goto(`/u:${$user?.username}/entry/${entry.detail.id}`);
					},
				});
				// jumpToArticle();
			},
			icon: "arrowRight",
			kbd: [["o", "a"]],
		},
		{
			id: "jump-to-tag",
			group: "jump",
			name: "Jump to Tag",
			perform: () => {
				showCommandPalette.out();
				commandPaletteStore.open({
					values: $page.data.tags,
					onSelect: async ({ detail }) => {
						await goto(`/u:${$page.data.user?.username}/t:${detail.name}`);
					},
				});
			},
			icon: "arrowRight",
			kbd: [["o", "t"]],
		},
		{
			id: "jump-to-subscription",
			group: "jump",
			name: "Jump to Subscription",
			perform: async () => {
				showCommandPalette.out();
				const subscriptions = await queryClient.ensureQueryData(
					listSubscriptionsQuery()
				);
				commandPaletteStore.open({
					values: subscriptions,
					onSelect: async ({ detail }) => {
						await goto(
							`/u:${$page.data.user?.username}/subscriptions/${detail.feedId}`
						);
					},
				});
			},
			icon: "arrowRight",
			kbd: [["o", "s"]],
		},
	];

	jump_commands.forEach((c) => commandStore.add(c, false));

	const settings_commands: Command[] = [
		{
			id: "theme",
			group: "settings",
			name: "Change theme",
			keywords: "theme dark light",
			perform: () => {
				commandPaletteStore.open({
					values: allowedThemes.map((t) => ({
						id: t,
						name: t,
						icon: "cog",
					})),
					onSelect: async ({ detail }) => {
						const { name } = detail;
						document.documentElement.setAttribute("data-theme", name);
						if (darkThemes.includes(name)) {
							document.documentElement.classList.add("dark");
						} else {
							document.documentElement.classList.remove("dark");
						}
						// fetch to set cookies
						// create formdata and append theme
						const formData = new FormData();
						formData.append("theme", name);
						await fetch("/settings/appearance?/setTheme", {
							method: "POST",
							body: formData,
						});
					},
				});
			},
			icon: "cog",
		},
	];
	settings_commands.forEach((c) => commandStore.add(c, false));

	const selected_article_commands: Command[] = [
		// TODO
		{
			id: "article-tag",
			name: `Tag article${$selectedItems.length > 1 ? "s" : ""}`,
			group: "adhoc-article-commands",
			icon: "tag",
			perform: async () => {
				modals.open(
					TagModal,
					{
						allTags: $page.data.allTags,
						articles: $selectedItems,
					},
					"tag-modal"
				);
				// const res = await updateTagsOnArticles(
				// 	$selectedItems.map((i) => i.id),
				// 	['test']
				// );
			},
		},
		{
			id: "article-delete",
			name: `Delete article${$selectedItems.length > 1 ? "s" : ""}`,
			group: "adhoc-article-commands",
			icon: "trash",
			perform: async () => {
				const confirm = window.confirm(
					`Really delete ${$selectedItems.length} items?`
				);
				if (confirm) {
					const s = syncStore.add();
					// REVIEW: soft delete?
					console.log({ $selectedItems });
					// TODO: need to fix this type
					const bookmark_ids: number[] = $selectedItems
						.map((s) => s.bookmark?.id)
						.filter((i) => i);
					const deleted = await trpc().bookmarks.delete.mutate(bookmark_ids);
					console.log({ deleted });
					await invalidateAll();
					syncStore.remove(s);
				}
				$selectedItems.forEach((item) => {
					//    TODO: delete
				});
			},
		},
		{
			id: "add-note",
			name: "Add note",
			group: "adhoc-article-commands",
			icon: "pencilAlt",
			perform: () => {
				modals.open(RichAnnotationInput, {
					onCancel: () => modals.close(),
					onSave: (contentData) => {
						$saveAnnotationMutation.mutate({
							entryId: $selectedItems.map((i) => i.id),
							contentData,
							type: "note",
						});
						$selectedItems = [];
						modals.close();
					},
				});
			},
		},
		{
			id: "snooze",
			name: "Snooze",
			group: "adhoc-article-commands",
			icon: "clock",
			perform: () => {
				modals.open(
					DatePicker,
					{
						onConfirm: (date) => {
							$updateMutation.mutate({
								entryId: $selectedItems.map((i) => i.id),
								data: {
									snoozedUntil: date,
								},
							});
						},
					},
					"date-picker",
					{
						maxWidth: "max-w-min",
					}
				);
			},
		},
		{
			id: "change-status",
			name: `Change status…`,
			group: "adhoc-article-commands",
			icon: "inboxIn",
			perform: () => {
				console.log({ $page });
				//copied from entry/page.svelte
				commandPaletteStore.open({
					values: $page.data.user?.states,
					itemIcon: (val, active) => {
						return {
							component: Icon,
							props: {
								name: LOCATION_TO_ICON_SOLID[val.type],
							},
						};
					},
					onSelect: async (e) => {
						try {
							console.log({ $selectedItems });
							const bookmarksToCreate = $selectedItems.filter(
								(i) => !i.bookmarks?.[0]
							);
							const bookmarksToUpdate = $selectedItems.filter(
								(i) => !!i.bookmarks?.[0]
							);
							if (bookmarksToCreate.length)
								$createBookmarkMutation.mutate({
									entryId_uri: $selectedItems.map((i) => ({
										entryId: i.id,
										uri: i.uri ?? undefined,
									})),
									data: {
										stateId: e.detail.id as number,
									},
								});
							if (bookmarksToUpdate.length)
								$updateMutation.mutate({
									entryId: $selectedItems.map((i) => i.id),
									data: {
										stateId: e.detail.id as number,
									},
								});
							console.log({ bookmarksToCreate, bookmarksToUpdate });
							// $updateMutation.mutate({
							// 	entryId: $selectedItems.map((i) => i.id),
							// 	data: {
							// 		stateId: e.detail.id as number,
							// 	},
							// });
						} catch (err) {
							throw err;
						}
					},
				});
				$selectedItems.forEach((item) => {
					//    TODO: delete
				});
			},
		},
		{
			id: "add-relation",
			group: "article",
			name: "Add relation",
			icon: "arrowRightLeft",
			perform: async () => {
				// open entry selector, then add relation
				showEntrySelector(queryClient, async ({ detail: entry }) => {
					// add relation
					$createRelation.mutate({
						entryId: $selectedItems.map((i) => i.id),
						relatedEntryId: entry.id,
					});
				});
			},
		},
		{
			id: "add-to-collection",
			group: "adhoc-article-commands",
			name: "Add to Collection",
			perform: async () => {
				// REVIEW: should we use createQuery here? Or just call trpc directly?
				// I think we want to use query so we can do swr
				// const query = createQuery({
				// 	queryKey: ['collections'],

				// })
				const collections = await trpc($page).collections.list.query();

				const values = [...collections];
				commandPaletteStore.open({
					values: collections,
					// itemIcon: (val, active) => {
					// 	return {
					// 		component: Icon,
					// 		props: {
					// 			name: LOCATION_TO_ICON_SOLID[val.type],
					// 		},
					// 	};
					// },
					onSelect: async ({ detail }) => {
						if (
							detail.id === "create-new" &&
							(detail as unknown as any).value
						) {
							// create new
							const collection = await trpc($page).collections.create.mutate({
								name: detail.value,
								entryIds: $selectedItems.map((e) => e.id),
							});
							console.log({ collection });
						} else {
							const collection = await trpc($page).collections.addItem.mutate({
								id: detail.id,
								entryId: $selectedItems.map((e) => e.id),
							});
							notifications.notify({
								title: `Added ${
									$selectedItems.length === 1
										? "entry"
										: $selectedItems.length + " entries"
								} to ${collection.name}`,
								type: "success",
								message: `<a href="/u:${$page.data.user?.username}/collection/${collection.id}">View ${collection.name}</a>`,
								icon: collection.icon,
							});
						}
						utils.collections.invalidate();
					},
					fallback: (input) => ({
						title: `Create new collection: <span class="text-muted/70">"${input}"</span>`,
						id: `create-new`,
						icon: "plusSm",
						value: input,
					}),
				});
			},
			icon: "squaresPlus",
		},
	];
	$: $selectedItems.length
		? selected_article_commands.forEach((command) =>
				commandStore.add(command, true)
		  )
		: ($commandStore = $commandStore.filter(
				(c) => c.group !== "adhoc-article-commands"
		  ));

	let height = tweened(200, {
		duration: 500,
	});
</script>

<svelte:window on:keydown={commandListener} on:touchstart={handleTouch} />
<!-- todo: use virtual list -->

<Dialog
	bind:open={$showCommandPalette}
	class="fixed inset-0 z-50 overflow-y-auto p-4 pt-[15vh]"
>
	<DialogOverlay
		bind:el={dialogRef}
		class="fixed inset-0 "
		transition={fade}
		transitionParams={{ duration: 150 }}
		on:outrostart={() => {
			$animationHappening = true;
		}}
		on:outroend={(e) => {
			console.log("outro done");
			$animationHappening = false;
			$term = "";
		}}
	/>
	<div
		transition:fadeScale={{ duration: 150, baseScale: 0.95 }}
		class="contents"
	>
		<Combobox
			values={$filteredActions}
			bind:value={$term}
			bind:height
			animateHeight={true}
			fillValue={false}
			on:select={({ detail }) => {
				detail?.perform({ page: $page, user: $user });
				$showCommandPalette = false;
			}}
			input={{
				class:
					"w-full bg-transparent text-lg border-0 focus:ring-0 text-content placeholder-muted p-4",
				placeholder: "Type a command…",
			}}
			options={{
				class: `max-h-96 pt-4 text-sm overflow-y-auto scrollbar-hide ${
					!$filteredActions.length ? "hidden" : ""
				}`,
			}}
			static={true}
			class="relative mx-auto max-w-2xl divide-y divide-border overflow-hidden rounded-xl bg-elevation p-2 shadow-3xl ring-1 ring-border transparency:bg-elevation/70 transparency:backdrop-blur-2xl  transparency:backdrop-brightness-125 transparency:backdrop-contrast-100 transparency:backdrop-saturate-200 dark:transparency:backdrop-blur-xl dark:transparency:backdrop-brightness-75 dark:transparency:backdrop-contrast-75 dark:transparency:backdrop-saturate-200"
		>
			<!-- these settings should maybe be for dark (class should be added if Color(bg) is dark): transparency:backdrop-blur-xl transparency:backdrop-brightness-75 transparency:backdrop-contrast-75 transparency:backdrop-saturate-200 -->
			<div slot="inputPeer" class="flex px-4 text-sm">
				{#if $selectedItems.length}
					<Selection>
						{$selectedItems.length > 1
							? $selectedItems.length + " items"
							: $selectedItems[0].title}
					</Selection>
				{:else if $page.data.entry || $page.data.article}
					{@const entry = $page.data.entry || $page.data.article}
					<Selection>
						{entry.title}
					</Selection>
				{/if}
			</div>
			<div slot="option" let:value let:active let:selected let:index>
				<!-- TODO: flesh out this separator -->
				{#if value.group && value.group !== $filteredActions[index - 1]?.group && index !== 0}
					<div class="h-4 w-full py-2">
						<div class="h-px bg-border " />
					</div>
				{/if}
				<div
					class="rounded-lg p-1 font-medium text-muted   {active
						? 'bg-elevation-hover/90 font-bold'
						: ''} flex h-12 w-full items-center justify-between gap-3.5 px-4 py-2"
				>
					<div class="flex gap-3.5">
						{#if value.icon}
							<Icon
								name={value.icon}
								className="{active
									? 'stroke-content'
									: 'stroke-content/75'} h-4 w-4"
							/>
						{/if}
						<span>{value.name}</span>
					</div>
					{#if value.kbd}
						<KbdGroup kbd={value.kbd} />
					{/if}
				</div>
			</div>
		</Combobox>
	</div>
</Dialog>
