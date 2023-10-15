import { browser } from '$app/environment';
import { queryKeys } from '$lib/queries/keys';
import { loadInfiniteQuery, server_infinite_query } from '$lib/queries/utils';
import { Writable, writable } from 'svelte/store';
import type { ListInput } from '../fetch.server';
import type { PageLoad } from './$types';
import { QueryOutput, query } from '$lib/queries/query';
import { useLibraryOptions } from '$lib/queries/queries';

export const load = (async (e) => {
    const { queryClient, state } = await e.parent()


    // const search = e.url.searchParams.get("search")?.trim() || undefined
    // console.log({ search })
    // if (search) console.log("searching")
    // else console.log("not searching")
    // const opts = queryKeys.entries.library(e.data.Status, {
    //     type: e.data.type,
    // })

    // if (browser) {
    //     const library_state = state.get("library");
    //     if (library_state) {
    //         const now = Date.now();
    //         const last = library_state.updated_at;
    //         // fetch if greater than stale time
    //         if (now - last > (library_state.staleTime || 0)) {
    //             const data = await query(e, "fetch_list", {
    //                 status: e.data.Status,
    //                 take: 25
    //             })
    //             state.set("library", {
    //                 updated_at: now,
    //                 data: writable(data),
    //                 staleTime: 1000 * 60 * 2, // 2 minutes
    //                 valid: true,
    //             })

    //         } else {
    //             return library_state.data as Writable<QueryOutput<"fetch_list">>;
    //         }
    //     } else {
    //         const data = await query(e, "fetch_list", {
    //             status: e.data.Status,
    //             take: 25
    //         })
    //         state.set("library", {
    //             updated_at: Date.now(),
    //             data: writable(data),
    //             staleTime: 1000 * 60 * 2, // 2 minutes
    //             valid: true,
    //         })
    //     }
    // }


    // queryClient.prefetchInfiniteQuery(
    //     {
    //         ...queryKeys.entries.library(e.data.Status),
    //         initialPageParam: undefined,
    //         getNextPageParam: lastPage => lastPage.nextCursor
    //     }
    // )
    return {
        ...e.data,
        // query: loadInfiniteQuery(queryClient, {
        //     ...opts,
        //     initialPageParam: <ListInput["cursor"]>undefined,
        //     getNextPageParam: lastPage => lastPage.nextCursor
        // }),
        // query_opts: server_infinite_query(queryClient, {
        //     ...opts,
        //     initialPageParam: <ListInput["cursor"]>undefined,
        //     getNextPageParam: lastPage => lastPage.nextCursor
        // })
    }
}) satisfies PageLoad
