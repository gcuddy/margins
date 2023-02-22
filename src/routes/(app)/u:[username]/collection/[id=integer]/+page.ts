import { collectionQuery } from '$lib/features/collections/queries';

import type { PageLoad } from './$types';

export const load = (async (e) => {
    const { parent, params } = e
    const { queryClient } = await parent();
    const query = collectionQuery(Number(params.id), e);
    const collection = await queryClient.ensureQueryData(query);
    // queryClient.prefetchQuery(query);
    console.log({ collection })
    return {
        collection,
        id: Number(params.id),
    };
}) satisfies PageLoad;
