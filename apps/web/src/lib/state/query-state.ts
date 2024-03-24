import { getContext, setContext } from "svelte";
import { derived, get, writable } from "svelte/store";
import type { Mutations } from '../../routes/queries.server';
import { page } from "$app/stores";
import { type MutationInput, mutation } from "$lib/queries/query";

// const query_lookup = writable(
//     {} as {
//         [id: string]: {
//             data: unknown;
//             last_updated: number;
//             stale_time: number;
//         }
//     }
// );

type LookupRef = {
    data: unknown;
    last_updated: number;
    stale_time: number;
}

/**
 * custom query cache store
 */
export function query_cache() {

    const { subscribe, update } = writable(
        {} as {
            [id: string]: LookupRef
        }
    );

    return {
        subscribe,
        update,
        invalidate: (id: string) => {
            update(q => {
                if (q[id]) {
                    q[id].last_updated = 0;
                }
                return q;
            })
        }
    }
}

export const query_lookup = query_cache();

export const set_query_context = (q: typeof query_lookup) => {
    setContext('__context_query', q)
}
export const get_query_context = () => {
    const ctx = getContext('__context_query');
    if (!ctx) {
        throw new Error(`[get_query_context] no context found`)
    }
    return ctx as typeof query_lookup;
}


type QueryBase<TData = unknown> = {
    data: TData | undefined;
    isSuccess: boolean;
    isLoading: boolean;
    isFetching: boolean;
    dataUpdatedAt: number;
}

type QueryLoading<TData = unknown> = QueryBase & {
    data: undefined | TData;
    isSuccess: false;
    isLoading: true;
}

type QuerySuccess<TData = unknown> = QueryBase<TData> & {
    data: TData;
    isSuccess: true;
    isLoading: false;
}

type QueryResult<TData = unknown> = QueryLoading<TData> | QuerySuccess<TData>;



type CreateQueryOpts<TData = unknown> = {
    key: string, stale_time?: number, fn: () => Promise<TData>, enabled?: boolean
}



// TODO: allow for passing in of store and using dynamic enabled option (will need to use derived store)
export function create_query<TData>({ key, stale_time = 0, fn, enabled }: {
    key: string, stale_time?: number, fn: () => Promise<TData>, enabled?: boolean
}) {
    console.log(`create_query`)

    // const query_lookup = get_query_context();

    const { subscribe, update, set } = writable<QueryResult<TData>>({
        data: undefined,
        isSuccess: false,
        isLoading: true,
        dataUpdatedAt: 0,
        isFetching: false,
    });

    const query = {
        subscribe,
        async refetch(opts?: {
            lookup_ref?: LookupRef,
            keep_data?: boolean
        }) {
            const {
                lookup_ref,
                keep_data = true
            } = opts || {};
            // using get here, probably not the best idea
            update(q => {
                console.log(`[refetch]`, { q })
                const prev_data = q.data || (lookup_ref?.data as TData | undefined)
                if (keep_data && prev_data) {
                    return {
                        dataUpdatedAt: q.dataUpdatedAt,
                        data: prev_data,
                        isLoading: false,
                        isSuccess: true,
                        isFetching: true,
                    }
                }
                return ({
                    dataUpdatedAt: q.dataUpdatedAt,
                    data: q.data,
                    isLoading: true,
                    isSuccess: false,
                    isFetching: true
                })
            })
            const data = await fn();
            const updated_at = new Date().getTime();
            set({
                dataUpdatedAt: updated_at,
                data,
                isLoading: false,
                isSuccess: true,
                isFetching: false,
            })
            query_lookup.update((lookup) => {
                lookup[key] = {
                    data,
                    last_updated: updated_at,
                    stale_time,
                }
                console.log(`[refetch]`, { lookup })
                return lookup;
            });
        }
    };

    function sync() {
        query_lookup.update((lookup) => {
            const q = lookup[key];
            if (q) {
                if (new Date().getTime() - q.last_updated > stale_time) {
                    console.log(`stale, refetching`)
                    query.refetch({
                        lookup_ref: q,
                        keep_data: true
                    });
                } else {
                    set({
                        dataUpdatedAt: q.last_updated,
                        data: q.data as TData,
                        isLoading: false,
                        isSuccess: true,
                        isFetching: false,
                    })
                }
            }
            if (!lookup[key]) {
                query.refetch();
                // lookup[key] = {
                //     data: undefined,
                //     last_updated: new Date().getTime(),
                //     stale_time,
                // }
            }
            return lookup;
        });
    }


    return {
        subscribe: (...args: Parameters<typeof query["subscribe"]>) => {
            console.log(`subscribe, here goes nothing`)
            sync()
            console.log(`done syncing`)
            return query.subscribe(...args);
        }
    }
}

export function create_mutation<TMutation extends keyof Mutations>(fn: TMutation) {

    const store = writable({
        mutate: (data: MutationInput<TMutation>) => {
            store.update(s => {
                return {
                    ...s,
                    isPending: true,
                }
            })
            return mutation(get(page), fn, data).finally(() => {
                store.update(s => {
                    return {
                        ...s,
                        isPending: false,
                    }
                })
            })
        },
        isPending: false,
    });

    return {
        subscribe: store.subscribe,
    }

    // return derived(page, ($page, set) => {
    //     return {
    //         mutate: (data: MutationInput<TMutation>) => {
    //             return mutation(get(page), fn, data);
    //         }
    //     }
    // })
}
