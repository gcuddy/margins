import { QueryClient } from "@tanstack/svelte-query";

import { browser } from "$app/environment";

// import { H } from "highlight.run";
import type { LayoutLoad } from "./$types";
import { trpcWithQuery } from "$lib/trpc/client";

export const load = (async (e) => {
    const { data } = e;
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                enabled: browser,
                staleTime: 1000 * 60 * 60, // 1 hour
                // cachetime 24 hours for persiter
                cacheTime: 1000 * 60 * 60 * 24, // 24 hours
                networkMode: "offlineFirst"
            },
            mutations: {
                networkMode: "offlineFirst"
            }
        },
    });
    if (data.user?.userId && browser) {
        // H.identify(data.user.username, {
        //     id: data.user.userId,
        // });
    }

    // get favorites
    console.time("favorites");
    // figure out a way to make this better
    const client = trpcWithQuery(e, queryClient);
    const utils = client.createContext();
    const favorites = data.authorized ? utils.favorites.list.getData() ?? (await utils.favorites.list.fetch()) : []
    console.timeEnd("favorites");
    return { queryClient, favorites, ...data };
}) satisfies LayoutLoad;
