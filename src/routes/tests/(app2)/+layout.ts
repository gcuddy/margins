import { writable } from 'svelte/store';
import { QueryClient } from '@tanstack/svelte-query';
import { browser } from '$app/environment';

export async function load({ data }) {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				enabled: browser,
				staleTime: 1000 * 60 * 2, // 2 minutes,
				gcTime: 1000 * 60 * 60 * 24 // 24 hours (for persistence)
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
