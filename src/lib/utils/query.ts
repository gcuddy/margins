import type { StoreValue } from '@melt-ui/svelte';
import {
    createQuery,
	type CreateBaseQueryOptions,
	type CreateQueryOptions,
	type QueryClient
} from '@tanstack/svelte-query';
import { Readable, get } from 'svelte/store';

async function createServerQuery<T extends CreateBaseQueryOptions & { ssr?: boolean }>(
	opts: T,
	queryClient: QueryClient
) {
	// etc

	// get query
	const queryKey = 'subscribe' in opts ? get(opts).queryKey : opts.queryKey;

	if (queryKey) {
		const cache = queryClient.getQueryCache().find({ queryKey });
		if (opts?.ssr !== false && !cache) {
			await queryClient.prefetchQuery(opts);
		}
	}

	return () =>
		createQuery({
			...opts,
			...(!cache ? { refetchOnMount: opts?.refetchOnMount ?? false } : {})
		});
}
