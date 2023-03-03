<script lang="ts">
	import { page } from "$app/stores";
	import { CreateBookmarkMutationKey, UpdateBookmarkMutationKey } from "$lib/features/entries/mutations";
	import { notifications } from "$lib/stores/notifications";
	import { selectedItems } from "$lib/stores/selectedItems";
	import { trpcWithQuery } from "$lib/trpc/client";
	import type { RouterOutputs } from "$lib/trpc/router";
	import { setContext } from "svelte";
	import { createAnnotation, SaveAnnotationMutationKey } from "$lib/features/annotations/mutations";

	console.time("MutationProvider");
	const client = trpcWithQuery($page);
	const utils = client.createContext();
	const updateMutation = client.bookmarks.update.createMutation({
		onMutate: ({ id, entryId, data }) => {
			// TODO: set data
			// TODO: type location?
			console.log({ id, data, $page, entryId });
			if (data.stateId && $page.data.location && entryId && $page.data.user) {
				// update current lists
				const newLocation = $page.data.user.stateIdToLocation.get(data.stateId as number);
				const newStateName = $page.data.user.stateIdToName.get(data.stateId as number);
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
							if (Array.isArray(entryId) ? entryId.includes(entry.id) : entry.id === entryId) {
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
    const createBookmarkMutation = client.bookmarks.create.createMutation({
        onSuccess: () => {
            utils.entries.invalidate();
            utils.bookmarks.invalidate();
        }
    });

    setContext(CreateBookmarkMutationKey, createBookmarkMutation);

	// $: entryId = $page.route.id?.includes("entry") && ($page.data.id as number | undefined);
	const saveAnnotationMutation = client.annotations.save.createMutation({
		onMutate: (data) =>{
			if (data.id && data.entryId && !Array.isArray(data.entryId)) {
				// optimstically update the cache for this entry
				// optimistic update: TODO cancel?
				// snapshot
                const entryId = data.entryId;
				const previous = utils.entries.load.getData();
				// optimstically update

				utils.entries.load.setData(
					{
						id: data.entryId,
					},
					(old) => {
						if (!old) return old;
						if (!$page.data.user) return old;
						// either update or add
						const existing = old.annotations.find((a) => a.id === data.id);
						console.log("existing: ", existing);
						if (!existing) {
							console.log({ data, old });
							console.log("hllloeoeooeoe");
                            //@ts-expect-error
							const annotation = createAnnotation(data, {
								entryId: data.entryId as number | undefined,
								user: $page.data.user,
							});
							console.log({ annotation });
							const updated = {
								...old,
								annotations: [
									...old.annotations,
									{
										...createAnnotation(data, {
											entryId,
											user: $page.data.user,
										}),
										...data,
									},
								],
							};
							console.log({ updated });
							return updated;
						}
						return {
							...old,
							annotations: old.annotations.map((a) => {
								if (a.id === data.id) {
									return {
										...a,
										...data,
									};
								}
								return a;
							}),
						};
					}
				);
			}
		},
		onSuccess: (data) => {
           console.log('invalidating', data)
            utils.entries.invalidate();
			// utils.entries.load.invalidate({
			// 	id: entryId,
			// });
			// utils.entries.listBookmarks.invalidate();
		},
	});

	setContext(SaveAnnotationMutationKey, saveAnnotationMutation);

	setContext(UpdateBookmarkMutationKey, updateMutation);
	console.timeEnd("MutationProvider");
</script>

<slot />
