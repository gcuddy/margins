import { writable, Readable, Writable } from 'svelte/store';

// fn, key, staletime

// two parts: fn part and returned data part

function queryStore() {

    const { subscribe, set, update } = writable<Record<string, {
        data: any;
        error: any;
        loading: boolean;
    }>>({});

    // cache that contains a key -> data, fn, staleTime mapping

    const _cache = writable(new Map<string, {
        fn: (...args: any[]) => Promise<any>;
        staleTime: number;
        data: any;
    }>())




    return {
        cache: (key: string, input: {
            fn: (...args: any[]) => Promise<any>;
            staleTime: number;
        }) => {
            // fetch data from cache
            _cache.update(cache => {

                const cached = cache.get(key);
                if (!cached) {
                    cache.set(key, {
                        fn: input.fn,
                        staleTime: input.staleTime,
                        data: input.fn(),
                    });
                } else {
                    // check if stale
                    if (Date.now() - cached.staleTime > cached.staleTime) {
                        // update data
                        cache.set(key, {
                            fn: input.fn,
                            staleTime: input.staleTime,
                            data: input.fn(),
                        });
                    }
                }
                return cache;
            })

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

    }
}