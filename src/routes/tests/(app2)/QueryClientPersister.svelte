<script lang="ts">
	import { get, set, del } from 'idb-keyval';

	import { onDestroy, onMount } from 'svelte';
	import type { QueryClient } from '@tanstack/query-core';
	import { setQueryClientContext } from '@tanstack/svelte-query';
	import { persistQueryClient } from '@tanstack/query-persist-client-core';
	import type { PersistedClient, Persister } from '@tanstack/query-persist-client-core';
	export let client: QueryClient;

	let restoring = false;

	setQueryClientContext(client);

	const persister: Persister = {
		async persistClient(client: PersistedClient) {
			console.log('persisting client');
			set('QUERY_PERSIST', client);
		},
		async restoreClient() {
			return await get<PersistedClient>('QUERY_PERSIST');
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
		restoring = true;
		const [unsubscribe, promise] = persistQueryClient({
			queryClient: client,
			persister,
			dehydrateOptions: {
				// shouldDehydrateQuery(query) {
				//     query.queryKey[0] ===
				// },
			},

		});
        console.log({unsubscribe, promise})
		promise
			.then(() => {
				client.mount();
				console.log({ client });
				// run paused mutations if you want
			})
			.finally(() => {
				restoring = false;
			});
		return () => {
			unsubscribe();
			client.unmount();
		};
	});
</script>

<slot />
