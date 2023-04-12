// lightweight home built query manager ala React Query

import { writable } from "svelte/store"
import { fetchMore } from "./(listables)/subscriptions/utils";

import { queries, query_keys } from "./queries.server";

import { stringify } from "devalue";
import type { RequestEvent } from "@sveltejs/kit";
import type { z } from "zod";

export function query<T extends keyof typeof queries>(
    fn: T,
    input: any,
    opts?: Partial<{
        fetcher: typeof fetch;
        userId: string | null;
    }>
) {
    const { fetcher = fetch, userId = null } = opts || {};
    const data = stringify(input);
    let url = `/tests/sq/${fn}?input=${data}`;
    if (userId) {
        url += `&userId=${userId}`;
    }
    type Data = ReturnType<typeof queries[T]["fn"]>;
    return fetcher(url).then((res) => res.json()) as Promise<Data>;
}

type Fn = keyof typeof queries;

// function fetch_api(fn: Fn) {
//     query
// }




export function query_store<T>(opts: {
    fn: () => Promise<T>;
    // fn: Fn
    staleTime: number;
}) {
    // function that returns a store,
    // which is a proxy that returns a promise
    // that resolves to the value of the query
    // and caches the value for a given time
    // and updates the cache when the query is called again

    let data_updated_timestamp: number | null = null;

    // const _fn = query(opts.fn, {})

    let loading = true;

    const store = writable<{
        data: T | null;
        loading: boolean;
    }>({
        data: null,
        loading: true,
    })


    async function get() {
        // run fn and put it in data
        store.update((value) => ({ ...value, loading: true }))
        const data = await opts.fn()
        data_updated_timestamp = Date.now()
        store.set({ data, loading: false })
    }

    function subscribe() {
        return store.subscribe((new_value) => {
            // if stale time, run get
            if (data_updated_timestamp === null || Date.now() - data_updated_timestamp > opts.staleTime) {
                get()
            }
        })
    }

    return {
        subscribe
    }
}

export const sq = (init?: RequestEvent, ctx?: {
    userId?: string | null;
}) => {
    // return an object with all the queries, where calling them calls our query helper function fully typed
    return Object.fromEntries(Object.entries(queries).map(([key, value]) => {
        return [
            key,
            (input: Parameters<typeof value.fn>["0"]["input"], staleTime = 0) => {
                return query_store({
                    fn: () => query(key as Fn, input),
                    staleTime
                } as const)
            }
        ] as const
    }))
}

function base_query_store() {
    // create base query store that has all the queries

    // sets gets context    
}



// usage: sq().tags({}) => returns query_store 