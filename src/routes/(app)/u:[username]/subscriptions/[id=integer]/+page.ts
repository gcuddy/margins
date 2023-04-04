import { trpcWithQuery } from '$lib/trpc/client';
import type { PageLoad } from './$types';

export const load = (async (event) => {
    const { params } = event;
    //    TODO: infinite
    // const query
    const { queryClient, user } = await event.parent();

    const client = trpcWithQuery(event, queryClient);
    const query = client.entries.byFeed.createServerInfiniteQuery({
        id: +params.id,
        take: 25
    }, {
        getNextPageParam: (lastPage) => lastPage.nextCursor
    })
    const subscription = user.subscriptions.find((s) => s.feed_id === +params.id);
    // const subscription = subscriptions.find((s) => s.feedId === +params.id);
    return {
        id: +params.id,
        title: subscription?.subscription_title,
        subscription,
        query
    };
}) satisfies PageLoad;
