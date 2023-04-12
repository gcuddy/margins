import { writable } from "svelte/store";
import type { fetchRss } from "./fetch.server";
import { stringify } from 'devalue';
import type { RequestEvent } from "@sveltejs/kit";

type Input = Record<string, any>;



export function fetchMore(input: Omit<Parameters<typeof fetchRss>[0], "userId">, _fetch = fetch) {
    // convert to query params, but first have to convert values to string and remoeve undefined
    const data = stringify(input);
    console.log({ data })
    return _fetch(`/tests/rss?input=${data}`).then((res) => res.json()) as ReturnType<typeof fetchRss>;
}


// store that stores fetching data
export function createFetchStore() {
    const { subscribe, set, update } = writable<Record<string, {
        data: any;
        error: any;
        loading: boolean;
    }>>({});

    return {
        subscribe,
        set,
        update,
        fetch: (key: string, fetcher: (...args: any[]) => Promise<any>) => {
            update((data) => {
                data[key] = {
                    data: data[key]?.data,
                    error: data[key]?.error,
                    loading: true,
                };
                return data;
            });
            fetcher().then((data) => {
                update((data) => {
                    data[key] = {
                        data,
                        error: data[key]?.error,
                        loading: false,
                    };
                    return data;
                });
            }).catch((error) => {
                update((data) => {
                    data[key] = {
                        data: data[key]?.data,
                        error,
                        loading: false,
                    };
                    return data;
                });
            });
        }
    };
}