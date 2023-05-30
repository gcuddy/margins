import { trpc } from '$lib/trpc/client';
import type { RouterOutputs } from '$lib/trpc/router';
import type { PageLoad } from './$types';

export const load = (async (event) => {
    const { params } = event;
    //    TODO: infinite
    // const query
    const { queryClient, user } = await event.parent();

    const client = trpc(event, queryClient);
    const ctx = client.createContext();
    const query = client.entries.byFeed.createServerInfiniteQuery({
        id: +params.id,
        take: 25
    }, {
        getNextPageParam: (lastPage) => lastPage.nextCursor
    })
    const subscriptions = await ctx.subscriptions.list.fetch()
    const subscription = subscriptions.find((s) => s.feed_id === +params.id);
    return {
        id: +params.id,
        title: subscription?.subscription_title,
        subscription,
        query
    };
}) satisfies PageLoad;
