import { writable } from 'svelte/store';
import { QueryClient } from '@tanstack/svelte-query'
import { browser } from '$app/environment'

export async function load({ data }) {
    const queryClient = new QueryClient({
        defaultOptions: {
          queries: {
            enabled: browser,
            staleTime: 1000 * 60 * 2, // 2 minutes,
          },
        },
      })
    return {
        ...data,
        current_entry_id: writable(null),
        queryClient
    }
}
