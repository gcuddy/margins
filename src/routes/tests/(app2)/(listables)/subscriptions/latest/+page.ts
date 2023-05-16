import { queryKeys } from '$lib/queries/keys';
import { loadInfiniteQuery } from '$lib/queries/utils';
import type { PageLoad } from './$types';

export const load = (async (e) => {
    const { queryClient } = await e.parent();

    const search = e.url.searchParams.get('search') ?? undefined;
    const opts = queryKeys.entries.rss(e, { search })
    return {
        ...e.data,
        query: loadInfiniteQuery(queryClient, {
            ...opts,
            defaultPageParam: undefined,
            getNextPageParam: lastPage => lastPage.nextCursor
        }),
        search
    };
}) satisfies PageLoad;