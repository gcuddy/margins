import type { LayoutLoad } from "./$types";
import { QueryClient, keepPreviousData } from '@tanstack/svelte-query'
import { browser } from '$app/environment';
import { create_cache } from "$lib/state";
import { createCachedValue } from "$lib/cache";

export const load = (({ data }) => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                enabled: browser,
                staleTime: 1000 * 60 * 2, // 2 minutes,
                placeholderData: keepPreviousData
            },
            mutations: {
                networkMode: "offlineFirst"
            }
        },
    })


    return { queryClient, state: createCachedValue("state", create_cache), ...data }
}) satisfies LayoutLoad;