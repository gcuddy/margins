<script lang="ts">
	import { get, set, del } from 'idb-keyval';

	import { onDestroy, onMount, setContext } from 'svelte';
	import type { QueryClient } from '@tanstack/query-core';
	import { setQueryClientContext } from '@tanstack/svelte-query';
	import { persistQueryClient } from '@tanstack/query-persist-client-core';
	import type { PersistedClient, Persister } from '@tanstack/query-persist-client-core';
	import { writable } from 'svelte/store';
	import { dev } from '$app/environment';
	import { noop } from '$lib/helpers';
	export let client: QueryClient;

	const restoring = writable(false);
	setContext('isRestoring', restoring);

	setQueryClientContext(client);

	console.log({ client });

	const key = 'QUERY_PERSIST';

	interface AsyncThrottleOptions {
		interval?: number;
		onError?: (error: unknown) => void;
	}

	// via https://github.com/TanStack/query/blob/beta/packages/query-async-storage-persister/src/asyncThrottle.ts
	export function asyncThrottle<Args extends ReadonlyArray<unknown>>(
		func: (...args: Args) => Promise<void>,
		{ interval = 1000, onError = noop }: AsyncThrottleOptions = {}
	) {
		if (typeof func !== 'function') throw new Error('argument is not function.');

		let running = false;
		let lastTime = 0;
		let timeout: ReturnType<typeof setTimeout>;
		let currentArgs: Args | null = null;

		const execFunc = async () => {
			if (currentArgs) {
				const args = currentArgs;
				currentArgs = null;
				try {
					running = true;
					await func(...args);
				} catch (error) {
					onError(error);
				} finally {
					lastTime = Date.now(); // this line must after 'func' executed to avoid two 'func' running in concurrent.
					running = false;
				}
			}
		};

		const delayFunc = async () => {
			clearTimeout(timeout);
			timeout = setTimeout(() => {
				if (running) {
					delayFunc(); // Will come here when 'func' execution time is greater than the interval.
				} else {
					execFunc();
				}
			}, interval);
		};

		return (...args: Args) => {
			currentArgs = args;

			const tooSoon = Date.now() - lastTime < interval;
			if (running || tooSoon) {
				delayFunc();
			} else {
				execFunc();
			}
		};
	}

	const trySave = async (persistedClient: PersistedClient): Promise<Error | undefined> => {
		try {
			persistedClient.clientState.queries.forEach((query) => {
				if (query.meta?.init) {
					delete query.meta.init;
				}
			});
			await set(key, persistedClient);
			return;
		} catch (error) {
			return error as Error;
		}
	};

	onMount(() => {
		console.log(`Mounting/restoring query client`);
		restoring.set(true);
		const [unsubscribe, promise] = persistQueryClient({
			queryClient: client,
			persister: {
				persistClient: asyncThrottle(
					async (persistedClient) => {
						let client: PersistedClient | undefined = persistedClient;
						let error = await trySave(client);
						let errorCount = 0;
						while (error && client) {
							errorCount++;
							if (client) {
								error = await trySave(client);
							}
						}
					},
					{
						interval: 1000
					}
				),
				restoreClient: async () => {
					const client = await get<PersistedClient>(key);
					return client;
				},
                removeClient: async () => del(key)
			},
			dehydrateOptions: {
				shouldDehydrateQuery(query) {
					const { queryKey } = query;
					if (query.queryKey[0] === 'entries' && query.queryKey[1] === 'list') {
						// ['entries', 'list']
						// filter on type === undefined  and search === undefined
						const filters = query.queryKey[2];
						if (!filters) return false;
						if (typeof filters !== 'object') return false;
						const { type, search } = filters as { type?: string; search?: string };
						if (type || search) return false;
						// TODO: get rid of meta

						return true;
					}
					if (query.queryKey[0] === 'entries' && query.queryKey[1] === 'detail') {
						return true;
					}
					if (query.queryKey[0] === 'entries' && query.queryKey[1] === 'all') {
						return true;
					}

					if (queryKey[0] === 'tags') {
						return true;
					}
					if (queryKey[0] === 'pins') {
						return true;
					}
                    if (queryKey[0] === 'notes') {
                        return true;
                    }

					return false;
				}
			}
			// hydrateOptions: {
			//     defaultOptions: {
			//         queries: {

			//         }
			//     }
			// }
		});
		console.log({ unsubscribe, promise });
		promise
			.then(() => {
				client.mount();
				// run paused mutations if you want
			})
			.finally(() => {
				console.log(`Done restoring query client`);
				restoring.set(false);
			});
		return () => {
			unsubscribe();
			client.unmount();
		};
	});
</script>

<slot isRestoring={$restoring} />
