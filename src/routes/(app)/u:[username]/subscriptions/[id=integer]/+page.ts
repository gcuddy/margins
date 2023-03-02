import { trpcWithQuery } from '$lib/trpc/client';
import type { PageLoad } from './$types';

export const load = (async (event) => {
    const { params } = event;
    const client = trpcWithQuery(event);
    const utils = client.createContext();
    //    TODO: infinite
    utils.entries.byFeed.prefetch({
        id: +params.id
    })
    const { subscriptions } = await event.parent();
    const subscription = subscriptions.find((s) => s.feedId === +params.id);
    return {
        subscription,
        id: +params.id,
    };
}) satisfies PageLoad;
