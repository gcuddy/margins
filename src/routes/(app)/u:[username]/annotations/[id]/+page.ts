
import { trpc } from '$lib/trpc/client';

import type { PageLoad } from './$types';

export const load = (async (e) => {
    const { queryClient } = await e.parent();
    const client = trpc(e, queryClient);
    return {
        query: client.annotations.detail.createServerQuery({ id: e.params.id }),
        id: e.params.id,
    };
}) satisfies PageLoad;
