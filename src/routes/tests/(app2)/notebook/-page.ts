import { query } from '$lib/queries/query';
import type { PageLoad } from './$types';



export const load = (async ({ data, parent, url, fetch }) => {

    const { session } = data;
    const { userId } = session;

    const { queryClient } = await parent();

    // const notebook = await queryClient.ensureQueryData({
    //     queryKey: ["notebook"],
    //     queryFn: () => query({ url, fetcher: fetch, userId: session.user.userId }, "notebook", {}),
    //     staleTime: 1000 * 60 * 2,
    // });

    // TODO: return this
    await queryClient.prefetchInfiniteQuery({
        queryKey: ["notebook"],
        queryFn: () => query({ url, fetcher: fetch, userId: session.user.userId }, "notebook", {}),
        staleTime: 1000 * 60 * 2,
        defaultPageParam: null
    })

    // return {
    //     annotations: notebook.notes,
    //     nextCursor: notebook.nextCursor,
    // };
}) satisfies PageLoad;
