import { trpcWithQuery } from '$lib/trpc/client';
import type { PageLoad } from './$types';

export const load = (async (event) => {
    const { params } = event;
    //    TODO: infinite
    // const query
    const { queryClient } = await event.parent();

    const client = trpcWithQuery(event, queryClient);
    const utils = client.createContext();
    utils.entries.byFeed.prefetch({
        id: +params.id
    })
    // const subscription = subscriptions.find((s) => s.feedId === +params.id);
    return {
        id: +params.id,
    };
}) satisfies PageLoad;
