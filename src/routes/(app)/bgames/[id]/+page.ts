import { trpc } from '$lib/trpc/client';
import type { RouterOutputs } from '$lib/trpc/router';
import type { PageLoad } from './$types';

export const load = (async (e) => {
    const { queryClient } = await e.parent();
    const client = trpc(e, queryClient);
    const utils = client.createContext()
    const queries = queryClient.getQueriesData({
        queryKey: [["public", "boardgames"]]
    })
        ?.flatMap(d => d[1])
        ?.filter(Boolean) as RouterOutputs["public"]["boardgames"] ?? [];
    const initialData = queries.find((d) => {
            return d.id === e.params.id;
    });
   console.log({initialData})
   if (!initialData) {
        await utils.public.boardGameById.prefetch({
           id: e.params.id
        });
   }
    return {
        initialData,
        id: e.params.id
    };
}) satisfies PageLoad;
