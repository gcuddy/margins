import { browser } from '$app/environment';
import { trpc } from '$lib/trpc/client';

import type { PageLoad } from './$types';

export const load = (async (e) => {
    const { parent, params } = e
    const { queryClient } = await parent();
    const client = trpc(e, queryClient);
    return {
        query: client.collections.detail.createServerQuery({ id: Number(params.id) }),
        id: Number(params.id),
    };
}) satisfies PageLoad;
