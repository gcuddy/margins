import { writable } from 'svelte/store';
import { QueryClient, keepPreviousData } from '@tanstack/svelte-query';
import { browser } from '$app/environment';

export async function load({ data }) {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				enabled: browser,
				staleTime: 1000 * 60 * 2, // 2 minutes,
				gcTime: 1000 * 60 * 60 * 24, // 24 hours (for persistence)
                placeholderData: keepPreviousData // keep previous data while fetching new data (TODO REVIEW if this is what we want )
			}
		}
	});

console.log({queryClient})
	return {
		...data,
		current_entry_id: writable(null),
		queryClient
	};
}
