import { queryKeys } from '$lib/queries/keys';
import { loadInfiniteQuery } from '$lib/queries/utils';
import type { PageLoad } from './$types';

export const load = (async (e) => {
    const opts = queryKeys.views.detail(e, +e.params.id)._ctx.entries(e, e.data.view.conditions as any)
    const { queryClient } = await e.parent()
    return {
        query: loadInfiniteQuery(queryClient, {
            ...opts,
            defaultPageParam: undefined,
            getNextPageParam: (lastPage) => lastPage?.nextCursor
        }),
        ...e.data,
    };
}) satisfies PageLoad;