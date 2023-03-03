
import { trpcWithQuery } from '$lib/trpc/client';

import type { PageLoad } from './$types';

export const load = (async (e) => {
    const { queryClient } = await e.parent();
    const client = trpcWithQuery(e, queryClient);
    return {
        query: client.annotations.detail.createServerQuery({ id: e.params.id }),
        id: e.params.id,
    };
}) satisfies PageLoad;
