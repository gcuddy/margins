import { queryKeys } from '$lib/queries/keys';
import { createInfiniteQueryOptions, loadInfiniteQuery, server_infinite_query } from '$lib/queries/utils';
import { writable } from 'svelte/store';
import type { PageLoad } from './$types';

export const load = (async (e) => {
    const {
        queryKey
    } = queryKeys.tags.detail(e.params.tag);
    const { queryClient } = await e.parent();
    return {
        ...e.data,
        // query_options: writable(createInfiniteQueryOptions({
        //     ...opts,
        //     defaultPageParam: undefined,
        //     getNextPageParam: (lastPage) => lastPage?.nextCursor,
        // })),
        // query: loadInfiniteQuery(queryClient, {
        //     ...opts,
        //     defaultPageParam: undefined,
        //     getNextPageParam: (lastPage) => lastPage?.nextCursor,
        // }),
        query_opts: server_infinite_query(queryClient, {
            ...opts,
            defaultPageParam: undefined,
            getNextPageParam: (lastPage) => lastPage?.nextCursor,
        })
    };
}) satisfies PageLoad;