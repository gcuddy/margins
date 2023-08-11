<script lang="ts">
	import { get, set, del } from 'idb-keyval';

	import { onDestroy, onMount, setContext } from 'svelte';
	import type { QueryClient } from '@tanstack/query-core';
	import { setQueryClientContext } from '@tanstack/svelte-query';
	import { persistQueryClient } from '@tanstack/query-persist-client-core';
	import type { PersistedClient, Persister } from '@tanstack/query-persist-client-core';
	import { writable } from 'svelte/store';
	import { dev } from '$app/environment';
	export let client: QueryClient;

	const restoring = writable(false);
	setContext('isRestoring', restoring);

	setQueryClientContext(client);

	console.log({ client });

	const persister: Persister = {
		async persistClient(client: PersistedClient) {
            if (dev) console.time('persistClient')
			// remove init meta from queries (it's not needed and probably not serializable)
			client.clientState.queries.forEach((query) => {
				if (query.meta?.init) {
					delete query.meta.init;
				}
			});
			set('QUERY_PERSIST', client);
            if (dev) console.timeEnd('persistClient')
		},
		async restoreClient() {
            if (dev) console.time('restoreClient')
			const client = await get<PersistedClient>('QUERY_PERSIST');
            if (dev) console.timeEnd('restoreClient')
            return client;
		},
		async removeClient() {
			await del('QUERY_PERSIST');
		}
	};

	// onMount(() => {
	// 	client.mount();
	// });
	// onDestroy(() => {
	// 	client.unmount();
	// });

	onMount(() => {
		console.log(`Mounting/restoring query client`);
		restoring.set(true);
		const [unsubscribe, promise] = persistQueryClient({
			queryClient: client,
			persister,
			dehydrateOptions: {
				shouldDehydrateQuery(query) {
					if (query.queryKey[0] === 'entries' && query.queryKey[1] === 'list') {
						// ['entries', 'list']
						// filter on type === undefined  and search === undefined
						const filters = query.queryKey[2];
						if (!filters) return false;
						if (typeof filters !== 'object') return false;
						const { type, search } = filters as { type?: string; search?: string };
						if (type || search) return false;
						console.log(`Dehydrating this query`, { query });
						// TODO: get rid of meta

						return true;
					}
					if (query.queryKey[0] === 'entries' && query.queryKey[1] === 'detail') {
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
