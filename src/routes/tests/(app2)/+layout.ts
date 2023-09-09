import { keepPreviousData, QueryClient } from '@tanstack/svelte-query';
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
			},
			queries: {
				enabled: browser,

				gcTime: 1000 * 60 * 60 * 24,
				// 24 hours (for persistence)
				// placeholderData: keepPreviousData // keep previous data while fetching new data (TODO REVIEW if this is what we want )
				networkMode: 'offlineFirst',

				staleTime: 1000 * 60 * 60, // 1 hour,
			},
		},
	});

	console.log({ queryClient });
	return {
		...data,
		current_entry_id: writable(null),
		queryClient,
	};
}
