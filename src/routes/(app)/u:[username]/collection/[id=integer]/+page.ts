import { browser } from '$app/environment';
import { trpcWithQuery } from '$lib/trpc/client';

import type { PageLoad } from './$types';

export const load = (async (e) => {
    const { parent, params } = e
    const { queryClient } = await parent();
    const client = trpcWithQuery(e, queryClient);
   if (!browser) {
    // create server query
    // else just return id and create in client?
   }
    return {
        query: client.collections.detail.createServerQuery({ id: Number(params.id) }, {
            staleTime: 1000 * 60 * 60 * 24 * 7,
        }),
        id: Number(params.id),
    };
}) satisfies PageLoad;
