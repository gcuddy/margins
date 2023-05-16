import { createQuery } from '@tanstack/svelte-query';
import type { PageLoad } from './$types';
import { query } from '$lib/queries/query';
import { loadQuery } from '$lib/queries/utils';
import { queryKeys } from '$lib/queries/keys';


export const load = (async ({ url, fetch, parent }) => {

    const { queryClient } = await parent();
    // const subscriptions = await queryClient.ensureQueryData({
    //     queryKey: ['subscriptions', 'list'],
    //     queryFn: () => query({
    //         url,
    //         fetch
    //     }, "list_subscriptions", {}),
    //     staleTime: 1000 * 60 * 2
    // })
    return {
        query: loadQuery(queryClient, queryKeys.subscriptions.list({ url, fetch }))
    };
}) satisfies PageLoad;