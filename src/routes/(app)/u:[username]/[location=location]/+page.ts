import { trpcWithQuery } from "$lib/trpc/client";

import type { PageLoad } from "./$types";
export const load = (async (event) => {
    const { data, parent } = event;
    const { queryClient } = await parent();

    console.time("entriesByLocationQuery")
    event.depends("entries")
    const client = trpcWithQuery(event, queryClient);
    const utils = client.createContext();
    await utils.entries.listBookmarks.prefetch({
        location: data.location
    })
    console.timeEnd("entriesByLocationQuery")

    return {
        ...data,
        ...(await parent()),
    };
}) satisfies PageLoad;
