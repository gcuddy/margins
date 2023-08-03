<script lang="ts">
	import { get, set, del } from 'idb-keyval';

	import { onDestroy, onMount, setContext } from 'svelte';
	import type { QueryClient } from '@tanstack/query-core';
	import { setQueryClientContext } from '@tanstack/svelte-query';
	import { persistQueryClient } from '@tanstack/query-persist-client-core';
	import type { PersistedClient, Persister } from '@tanstack/query-persist-client-core';
	import { writable } from 'svelte/store';
	export let client: QueryClient;

	const restoring = writable(false);
	setContext('isRestoring', restoring);

	setQueryClientContext(client);

	console.log({ client });

	const persister: Persister = {
		async persistClient(client: PersistedClient) {
			console.log('persisting client', client);
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
		restoring.set(true);
		const [unsubscribe, promise] = persistQueryClient({
			queryClient: client,
			persister
		});
		console.log({ unsubscribe, promise });
		promise
			.then(() => {
				client.mount();
				console.log({ client });
				// run paused mutations if you want
			})
			.finally(() => {
				restoring.set(false);
			});
		return () => {
			unsubscribe();
			client.unmount();
		};
	});
</script>

<slot isRestoring={$restoring} />
