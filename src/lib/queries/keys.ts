import { createQueryKeyStore, type inferQueryKeyStore } from "@lukemorales/query-key-factory";
import { type QueryInit, query } from "./query";
import type { Bookmark } from "@prisma/client";
import type { Type } from "$lib/types";
import type { ListInput } from "@/routes/tests/(app2)/(listables)/library/fetch.server";
import type { Condition } from "@/routes/tests/(app2)/views/new/View";

export const queryKeys = createQueryKeyStore({
    entries: {
        detail: (id: string) => ({
            queryKey: [id],
            queryFn: () => fetch(`https://jsonplaceholder.typicode.com/posts/${id}`).then(res => res.json()),
            contextQueries: {
                mentions: {
                    queryKey: null,
                    queryFn: () => fetch(`https://jsonplaceholder.typicode.com/posts/${id}/comments`).then(res => res.json())
                }
            }
        }),
        feedId: (init: QueryInit, id: number) => ({
            queryKey: [id],
            queryFn: async () => query(init, "entriesByFeedId", { id }),
        }),
        library: (status: Bookmark["status"], filter?: { type?: Type, search?: string }) => ({
            queryKey: [status, filter],
            queryFn: async (ctx) => query(ctx.meta || {}, "fetch_list", {
                status,
                take: 25,
                filter,
                cursor: (ctx.pageParam as ListInput["cursor"]) ?? undefined
            })
        }),
        rss: (init: QueryInit, filters: { podcasts?: boolean, search?: string } = {}) => ({
            queryKey: [{ filters }],
            queryFn: async (ctx) => query(init, "rss", {
                take: 25,
                cursor: ctx.pageParam as Date | null | undefined,
                podcasts: filters?.podcasts ?? false,
                search: filters?.search ?? undefined
            }),
            contextQueries: {
                search: (init: QueryInit, search: string) => ({
                    queryKey: [query],
                    queryFn: async (ctx) => query(init, "rss", { search, take: 25, cursor: ctx.pageParam as Date | null | undefined }),

                })
            }
        })
    },
    subscriptions: {
        list: (init: QueryInit, filters?: Record<string, string>) => ({
            queryKey: [{ filters }],
            queryFn: async () => query(init, "list_subscriptions", {}),
        })
    },
    collections: {
        list: (init: QueryInit, filters?: Record<string, string>) => ({
            queryKey: [{ filters }],
            queryFn: async () => query(init, "collections", {}),
        })
    },
    search: {
        books: (init: QueryInit, q: string) => ({
            queryKey: [q],
            queryFn: async () => query(init, "searchBooks", { q }),
        }),
        music: (init: QueryInit, q: string) => ({
            queryKey: [q],
            queryFn: async () => query(init, "searchMusic", { q }),
        }),
    },
    tags: {
        detail: (name: string) => ({
            queryKey: [name],
            queryFn: async (ctx) => query(ctx.meta || {}, "entries_by_tag", { name: ctx.queryKey[2], cursor: ctx.pageParam as number | undefined }),
        }),
        list: (init: QueryInit, filters: Record<string, string>) => ({
            queryKey: [filters],
            queryFn: async () => query(init, "tags", {}),
        })
    },
    views: {
        detail: (init: QueryInit, id: number) => ({
            queryKey: [id],
            contextQueries: {
                entries: (init: QueryInit, conditions: Condition[]) => ({
                    queryKey: ["entries"],
                    queryFn: async (ctx) => query(init, "view_entries", {
                        conditions,
                        cursor: ctx.pageParam as Date | null | undefined
                    })
                })
            }
        })
    }
})


export type QueryKeys = inferQueryKeyStore<typeof queryKeys>;
export type FieldPath<T extends object> = [keyof T, ...(string | number)[]];
