<script lang="ts">
	import { get as getItem, set as setItem, del as removeItem } from 'idb-keyval';
	import { onDestroy, onMount, setContext } from 'svelte';
	import type { QueryClient } from '@tanstack/query-core';
	import { setQueryClientContext } from '@tanstack/svelte-query';
	import { persistQueryClient } from '@tanstack/query-persist-client-core';
	import type { PersistedClient, Persister } from '@tanstack/query-persist-client-core';
	import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';

	import { writable } from 'svelte/store';
	import { dev } from '$app/environment';
	export let client: QueryClient;

	const restoring = writable(false);
	setContext('isRestoring', restoring);

	setQueryClientContext(client);

	console.log({ client });

	const key = 'QUERY_OFFILNE';

	onMount(() => {
		console.log(`Mounting/restoring query client`);
		restoring.set(true);
		const [unsubscribe, promise] = persistQueryClient({
			queryClient: client,
			persister: createAsyncStoragePersister({
				storage: {
					getItem: async (key: string) => {
						const val = await getItem<string | undefined>(key);
						return val ?? null;
					},
					setItem,
					removeItem
				}
			}),
			// persister: new CustomPersister({}),
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
                        console.log('persisting entries/all')
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
