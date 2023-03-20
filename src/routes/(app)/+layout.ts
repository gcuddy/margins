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

    // get favorites
    console.time("favorites");
    // figure out a way to make this better
    const favorites = data.authorized ? await queryClient.ensureQueryData(favoritesQuery(e)) : []
    console.timeEnd("favorites");

    return { queryClient, favorites, ...data };
}) satisfies LayoutLoad;
