import type { Status } from "@prisma/client";
import { queryOptions, infiniteQueryOptions, type Meta } from "./utils";
import { type QueryFunctionContext, createInfiniteQuery, type QueryKey } from "@tanstack/svelte-query";
import { MutationInput, type QueryInput, query, InfiniteQueries } from "./query";
import type { ListInput } from "@/routes/tests/(app2)/(listables)/library/fetch.server";
import { type QueryKeys, queryKeys } from "./keys";
import type { Queries, QueriesWithCursorInput } from "@/routes/tests/(app2)/queries.server";

// const keys = { list: (status: Status) => ['library', status] as const,
// }


// export const libraryOptions = (status: Status) => infiniteQueryOptions({
//     queryKey: keys.list(status),
//     queryFn: fetch_list,
//     staleTime: 5 * 1000,
//     getNextPageParam: (lastPage) => lastPage.nextCursor,
//     defaultPageParam: undefined,
// })


type LibraryList = QueryKeys['entries']['library']

const fetch_library = async (ctx: QueryFunctionContext<LibraryList['queryKey'], QueryInput<'fetch_list'>['cursor']>) => {
    const { meta, queryKey, } = ctx;
    console.log('running fetch_library inside queryfunctioncontext')
    console.log({ ctx })
    return query(meta as Meta, "fetch_list", {
        status: queryKey[2],
        take: 25,
        cursor: ctx.pageParam,
        filter: {
            search: queryKey[3]?.search,
            type: queryKey[3]?.type,
        }
    })
}

export const useLibraryOptions = (status: Status, search?: string) => infiniteQueryOptions({
    ...queryKeys.entries.library(status, search ? { search } : {}),
    queryFn: fetch_library,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    defaultPageParam: undefined,
});




const tag_deets = async (ctx: QueryFunctionContext<QueryKey, QueryInput<"entries_by_tag">['cursor']>) => query(ctx.meta as Meta, "entries_by_tag", { name: ctx.queryKey[2], cursor: ctx.pageParam })

export const tagDetailOptions = (name: string) => {
    return createInfiniteQuery({
        queryKey: queryKeys.tags.detail(name).queryKey,
        queryFn: (ctx) => query(ctx.meta as Meta, "entries_by_tag", { name: ctx.queryKey[2], cursor: ctx.pageParam }),
        getnextPageParam: (lastPage) => lastPage.nextCursor,
        defaultPageParam: undefined,
    }
    )
}
export function useLibrary(status: Status) {
    return createInfiniteQuery({
        ...queryKeys.entries.library(status),
        queryFn: fetch_library,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        defaultPageParam: undefined,
    })
}


