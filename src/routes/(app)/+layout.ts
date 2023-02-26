import { QueryClient } from "@tanstack/svelte-query";

import { browser } from "$app/environment";

import type { LayoutLoad } from "./$types";
import { favoritesQuery } from "./Sidebar.svelte";

export const load = (async (e) => {
    const { data } = e;
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                enabled: browser,
                staleTime: 5 * (60 * 1000), // 5 mins
                cacheTime: 10 * (60 * 1000), // 10 mins
                networkMode: "offlineFirst"
            },
            mutations: {
                networkMode: "offlineFirst"
            }
        },
    });

    // get favorites
    console.time("favorites");
    const favorites = data.authorized ? await queryClient.ensureQueryData(favoritesQuery(e)) : []
    console.log({ favorites });
    console.timeEnd("favorites");

    return { queryClient, favorites, ...data };
}) satisfies LayoutLoad;
