import type { CreateQueryOptions } from "@tanstack/svelte-query";
import type { TRPCClientInit } from "trpc-sveltekit";



const queryKeys = () => ({
    list: ["collections"] as const,
    detail: (id: number) => [...queryKeys().list, id] as const,
})

export const listCollectionsQuery = (init?: TRPCClientInit) => ({
    queryKey: ["collections"],
    queryFn: async () => trpc(init).collections.list.query(),
});


export const collectionQuery = (id: number, init?: TRPCClientInit) => ({
    queryKey: queryKeys().detail(id),
    queryFn: async () => trpc(init).collections.detail.query({ id }),
}) satisfies CreateQueryOptions;

type CollectionQueryReturnType = Awaited<ReturnType<typeof collectionQuery>["queryFn"]>;

// generic type for the return type of a query
type Awaited<T> = T extends PromiseLike<infer U> ? U : T;
// e.g.
// type CollectionQueryReturnType = Awaited<ReturnType<typeof collectionQuery>["queryFn"]>;

type X<T extends CreateQueryOptions> = T["queryFn"];

export type QueryReturnType<T extends Required<Pick<CreateQueryOptions, "queryFn">>> = Awaited<ReturnType<T["queryFn"]>>;
