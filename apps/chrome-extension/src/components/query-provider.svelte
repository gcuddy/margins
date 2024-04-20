<script lang="ts">
	import { QueryClient } from '@tanstack/svelte-query';
	import { PersistQueryClientProvider } from '@tanstack/svelte-query-persist-client';
	import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
	import { onMount } from 'svelte';

	const queryClient = new QueryClient();

	const persister = createAsyncStoragePersister({
		storage: {
			getItem: async (key: string) => {
				const { [key]: cached } = await chrome.storage.local.get(key);
				return cached;
			},
			removeItem: async (key: string) => {
				await chrome.storage.local.remove(key);
			},
			setItem: async (key: string, value: any) => {
				await chrome.storage.local.set({ [key]: value });
			},
		},
	});

	onMount(() => {});
</script>

<PersistQueryClientProvider client={queryClient} persistOptions={{ persister }}>
	<slot />
</PersistQueryClientProvider>
