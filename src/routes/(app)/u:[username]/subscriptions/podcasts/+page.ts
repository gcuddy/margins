import { trpc } from "$lib/trpc/client";
import type { PageLoad } from "./$types";

export const load = (async (evt) => {
    const { queryClient } = await evt.parent();
    const client = trpc(evt, queryClient);
    const query = client.entries.listForUserSubscriptions.createServerInfiniteQuery({
        podcasts: true
    }, {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
    });
    return {
        query,
    };
}) satisfies PageLoad;
