import type { QueryClient } from "@tanstack/svelte-query";

import { commandPaletteStore } from "$lib/components/CommandPalette/store";
import { notifications } from "$lib/stores/notifications";
import { trpc } from "$lib/trpc/client";
import type { RouterOutputs } from "$lib/trpc/router";

import { listCollectionsQuery } from "./queries";
type Collection = RouterOutputs["collections"]["addItem"]

// REVIEW: hate that we have to get the queryClient passed in....
export const addEntriesToCollection = async (queryClient: QueryClient, entryIds: number[], onSelect?: (c: Collection) => void) => {
    const collections = await queryClient.ensureQueryData(listCollectionsQuery());
    let collection: Collection | undefined = undefined
    // REVIEW: is this a super hacky way to do this?
    commandPaletteStore.open({
        values: collections,
        onSelect: async ({ detail }, $page) => {
            //@ts-expect-error
            if ((detail.id as unknown as string) === "create-new" && detail.value) {
                collection = await trpc().collections.create.mutate({
                    name: detail.value,
                    entryIds,
                });
                // navigate to collection
                notifications.notify({
                    title: `Created collection: ${collection.name}`,
                    type: "success",
                    message: `<a href="/u:${$page.data.user?.username}/collection/${collection.id}">View ${collection.name}</a>`,
                    icon: collection.icon,
                });
                console.log({ collection });
            } else {
                collection = await trpc().collections.addItem.mutate({
                    id: +detail.id,
                    entryId: entryIds,
                });
                notifications.notify({
                    title: `Added entry to ${collection.name}`,
                    type: "success",
                    message: `<a href="/u:${$page.data.user?.username}/collection/${collection.id}">View ${collection.name}</a>`,
                    icon: collection.icon,
                });
            }
            if (onSelect) {
                onSelect(collection);
            }
        },
        fallback: (input) => ({
            title: `Create new collection: <span class="text-gray-500 dark:text-gray-400">"${input}"</span>`,
            id: `create-new`,
            icon: "plusSm",
            value: input,
        }),
    });
};
