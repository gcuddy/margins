import { QueryClient } from "@tanstack/svelte-query";

import { browser } from "$app/environment";

// import { H } from "highlight.run";
import type { LayoutLoad } from "./$types";
import { trpcWithQuery } from "$lib/trpc/client";
import type { Location } from "$lib/prisma/kysely/types";

type KeySelector<T> = (item: T) => string;
function groupBy<T>(array: Iterable<T>, keySelector: KeySelector<T>): Record<string, T[]> {
    return Array.from(array).reduce(
        (acc: Record<string, T[]>, item: T) => {
            const key = keySelector(item);
            if (key in acc) {
                // found key, push new item into existing array
                acc[key].push(item);
            } else {
                // did not find key, create new array
                acc[key] = [item];
            }
            return acc;
        },
        {} // start with empty object
    );
}


export const load = (async (e) => {
    const { data } = e;
    const { theme } = data;
    // const queryClient = new QueryClient({
    //     defaultOptions: {
    //         queries: {
    //             enabled: browser,
    //             staleTime: 1000 * 60 * 60, // 1 hour
    //             // cachetime 24 hours for persiter
    //             cacheTime: 1000 * 60 * 60 * 24, // 24 hours
    //             networkMode: "offlineFirst"
    //         },
    //         mutations: {
    //             networkMode: "offlineFirst"
    //         }
    //     },
    // });
    const client = trpcWithQuery(e, queryClient);
    const utils = client.createContext();
    const favorites = data.authorized ? utils.favorites.list.getData() ?? (await utils.favorites.list.fetch()) : []
    console.timeEnd("favorites");
    const tags_data = utils.user.getTags.getData() ?? utils.user.getTags.fetch();
    const user_data = utils.user.getUser.getData() ?? utils.user.getUser.fetch()
    const states_data = utils.user.getStates.getData() ?? utils.user.getStates.fetch();
    const sub_data = utils.subscriptions.list.getData() ?? utils.subscriptions.list.fetch();
    const [user, states, tags, subscriptions] = await Promise.all([user_data, states_data, tags_data, sub_data]);
    const locations = ["inbox", "soon", "later", "archive"];
    const sortedStates = states?.sort(
        (a, b) => locations.indexOf(a.type) - locations.indexOf(b.type)
    );
    const locationLookup = groupBy(sortedStates || [], (state) => state.type);
    const stateIdToLocation: Map<number, Location> = new Map((sortedStates || []).map((state) => [state.id, state.type]))
    const stateIdToName: Map<number, string> = new Map((sortedStates || []).map((state) => [state.id, state.name]));

    return {
        queryClient, favorites,
        user: {
            ...user,
            states: sortedStates,
            locationLookup,
            stateIdToLocation,
            stateIdToName,
            tags,
            subscriptions
        },
        theme,
        authorized: true,
    };
}) satisfies LayoutLoad;
