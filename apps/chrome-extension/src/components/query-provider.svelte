<script lang="ts">
	import { QueryClient, useIsRestoring } from '@tanstack/svelte-query';
	import { PersistQueryClientProvider } from '@tanstack/svelte-query-persist-client';
	import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
	import { onMount } from 'svelte';

	const queryClient = new QueryClient();

	const persister = createAsyncStoragePersister({
		storage: {
			getItem: async (key: string) => {
				console.log('getting item from storage with key:', key);
				const { [key]: cached } = await chrome.storage.local.get(key);
				return cached;
			},
			removeItem: async (key: string) => {
				await chrome.storage.local.remove(key);
			},
			setItem: async (key: string, value: any) => {
				console.log('setting item in storage with key:', key);
				await chrome.storage.local.set({ [key]: value });
			},
		},
	});

	onMount(() => {});
	const restoring = useIsRestoring();
</script>

<PersistQueryClientProvider client={queryClient} persistOptions={{ persister }}>
	{#if $restoring}
		<div>Restoring...</div>
	{:else}
		<slot />
	{/if}
</PersistQueryClientProvider>
