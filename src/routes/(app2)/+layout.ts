import { experimental_createPersister } from '@tanstack/query-persist-client-core';
import { keepPreviousData, QueryClient } from '@tanstack/svelte-query';
import { del, get, set } from 'idb-keyval';
import { writable } from 'svelte/store';
import { toast } from 'svelte-sonner';

import { browser } from '$app/environment';

export async function load({ data }) {
	const queryClient = new QueryClient({
		defaultOptions: {
			mutations: {
				onError: (err) => {
					if (browser) {
						toast.error(err.message);
					}
				},
				onSuccess: (opts) => {
					// queryClient.invalidateQueries();
				},
			},
			queries: {
				enabled: browser,

				gcTime: 1000 * 60 * 60 * 2, // 2 hours
				// 24 hours (for persistence)
				// placeholderData: keepPreviousData // keep previous data while fetching new data (TODO REVIEW if this is what we want )
				networkMode: 'offlineFirst',
				persister: browser
					? experimental_createPersister({
							filters: {
								predicate: (query) => {
									// Don't persist search queries
									const shouldPersist = !query.queryKey.some(
										(key) => key === 'search',
									);
									// console.log({ shouldPersist, queryKey: query.queryKey });
									return shouldPersist;
								},
							},
							storage: {
								getItem: async (key) => {
									return (await get(key)) ?? null;
								},
								removeItem: del,
								setItem: set,
							},
					  })
					: undefined,
				staleTime: 1000 * 60 * 60, // 1 hour,
				// Moving this default to 10 seconds for now, till we fix up all invalidation bugs
				// staleTime: 1000 * 10, // 10 seconds,
			},
		},
	});

	// console.log({ queryClient });
	return {
		...data,
		current_entry_id: writable(null),
		queryClient,
	};
}
