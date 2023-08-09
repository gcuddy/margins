import type { Queries } from "@/routes/tests/(app2)/queries.server";
import { getContext, setContext } from "svelte";
import { query } from "./queries/query";
import { page } from "$app/stores";
import { type Readable, derived, get, writable, type Writable } from "svelte/store";
import type { Session, User } from 'lucia';
import type { EntryInList } from "./db/selects";


export const STATE_CONTEXT_KEY = Symbol("state_context_key");

export function get_state_context() {
    const ctx = getContext(STATE_CONTEXT_KEY);
    if (!ctx) {
        throw new Error("No state context found. Did you forget to wrap your app in a <State /> component?")
    }
    return ctx;
}

export function set_state_context(state: unknown) {
    setContext(STATE_CONTEXT_KEY, state);
}

type CacheItem = {
    data: Writable<{
        [key: string]: unknown;
    }>,
    valid: boolean;
    updated_at: number;
    staleTime: number;
}

export function create_cache<TItem extends CacheItem>() {
    const cache = new Map<string, {
        data: Writable<{
            [key: string]: unknown;
        }>,
        valid: boolean;
        updated_at: number;
        staleTime: number;
    }>();
    return cache;
}


function create_state_client() {
    const store = writable(new Map<string[], CacheItem>());


    // init
    // update

    return {
        subscribe: store.subscribe
    }
}

export function create_lists_state() {
    // map of [list, list_id] -> entry_id[]
    const { update, subscribe } = writable(new Map<string[], number[]>());

    function init(lists: [string[], number[]][]) {
        update(lookup => {
            for (const [list, entries] of lists) {
                lookup.set(list, entries);
            }
            return lookup;
        })
    }

    function update_list(list: string[], entries: number[]) {
        update(lookup => {
            lookup.set(list, entries);
            return lookup;
        })
    }

    return {
        subscribe,
        init,
        update_list
    }
}

export function create_tags_state() {
    // map of id -> name
    const { update, subscribe } = writable(new Map<number, string>());

    function init(tags: {
        id: number;
        name: string;
    }[]) {
        update(lookup => {
            for (const tag of tags) {
                lookup.set(tag.id, tag.name);
            }
            return lookup;
        })
    }

    function add(id: number, name: string) {
        update(lookup => {
            lookup.set(id, name);
            return lookup;
        })
    }

    return {
        subscribe,
        init,
        add,
        remove: (id: number) => {
            update(lookup => {
                lookup.delete(id);
                return lookup;
            })
        }
    }
}


export function create_entries_state() {
    //  map of id, item
    const { update, subscribe } = writable(new Map<number, EntryInList>());

    function init(entries: EntryInList[]) {
        update(lookup => {
            for (const entry of entries) {
                if (!lookup.has(entry.id)) {
                    lookup.set(entry.id, entry);
                }
            }
            return lookup;
        })
    }

    function update_entry(entry: EntryInList) {
        update(lookup => {
            lookup.set(entry.id, entry);
            return lookup;
        })
    }

    return {
        subscribe,
        init,
        update_entry
    }
}



// class State {
//     constructor() {

//     }
// }

type Opts = {
    staleTime?: number;
}

type IndividualState<TData = unknown> = {
    data: TData | null;
    loading: boolean;
    updated_at: number;
}


function async_derived<T, R>(store: Readable<T>, callback: ($store: T) => Promise<R>, initial_value?: R) {
    let previous = 0;

    return derived(store, ($store, set) => {
        const start = Date.now();
        Promise.resolve(callback($store)).then(value => {
            if (start > previous) {
                previous = start;
                set(value);
            }
        }).catch(err => {
            console.error(err);
        })
    }, initial_value)
}
export type QueryInit = {
    url: URL;
    fetcher?: typeof fetch;
    userId?: string | null;
    fetch?: typeof globalThis.fetch;
    data?: {
        userId?: string | null;
        session?: Session | null;
        user?: User | null;
    } | null;
};

type QueryState<TData> = Readable<IndividualState<TData>> & {
    fetch: Promise<TData>;
}

export function create_state<TKey extends keyof Queries>(init: QueryInit, key: TKey, input: Parameters<Queries[TKey]["fn"]>[0]["input"], opts?: Opts): QueryState<Awaited<ReturnType<Queries[TKey]["fn"]>>>;

export function create_state<TKey extends keyof Queries>(key: TKey, input: Parameters<Queries[TKey]["fn"]>[0]["input"], opts?: Opts): QueryState<Awaited<ReturnType<Queries[TKey]["fn"]>>>;

export function create_state<TKey extends keyof Queries>(
    initOrKey: QueryInit | TKey,
    keyOrInput: TKey | Parameters<Queries[TKey]["fn"]>[0]["input"],
    inputOrOpts?: Parameters<Queries[TKey]["fn"]>[0]["input"] | Opts,
    opts?: Opts
) {
    let init: QueryInit | undefined = undefined;
    let key: TKey;
    let input: Parameters<Queries[TKey]["fn"]>[0]["input"];
    if (typeof initOrKey === "string") {
        key = initOrKey;
        input = keyOrInput as Parameters<Queries[TKey]["fn"]>[0]["input"];
        opts = inputOrOpts as Opts;
    } else {
        init = initOrKey;
        key = keyOrInput as TKey;
        input = inputOrOpts as Parameters<Queries[TKey]["fn"]>[0]["input"];
    }
    // const client = get_state_context();

    type Return = Awaited<ReturnType<Queries[TKey]["fn"]>>
    type Store = IndividualState<
        Return
    >
    // const promise = query(get(page), key, input);

    const options = writable({
        key,
        input,
        opts
    })

    // const store = writable<Store>({
    //     data: promise,
    //     loading: true,
    //     updated_at: 0
    // })

    // const get_data = () => {
    //     // run fn and put it in data
    //     store.update((value) => ({ ...value, loading: true }))
    //     store.set({ data: promise, loading: false, updated_at: Date.now() })
    // }

    const should_fetch = (state: Pick<Store, "data" | "updated_at">) => {
        if (state.data === null || (Date.now() - state.updated_at > (opts?.staleTime || 0))) {
            return true;
        }
        return false;
    }



    let previous_updated_at = 0;
    let previous_data: Return | null = null;



    const data_derived = derived<typeof options, Store>(options, ($options, set) => {
        const start = Date.now();
        console.log({ previous_data, previous_updated_at })
        if (should_fetch({
            data: previous_data,
            updated_at: previous_updated_at
        })) {
            console.log("[data_derived] FETCHING")
            query(init || get(page), $options.key, $options.input).then(value => {
                console.log({ value })
                if (start > previous_updated_at) {
                    previous_updated_at = start;
                    previous_data = value;
                    set({
                        data: value,
                        loading: false,
                        updated_at: Date.now()
                    })
                }
            }).catch(err => {
                console.error(err);
            })
        }
    }, {
        data: null,
        loading: true,
        updated_at: 0
    })

    return {
        subscribe: data_derived.subscribe,
        // fetch: Promise.resolve(get(data_derived))
        // invalidate: () => {
        //     // set data_updated_timestamp to 0
        //     store.update((value) => ({ ...value, updated_at: 0 }))
        // }
    }

}
