import type { InfiniteData, QueryClient } from '@tanstack/svelte-query';
import { checkedEntryIds } from './store';
import { get } from 'svelte/store';
import type { QueryOutput } from '$lib/queries/query';

export function getCheckedEntriesFromQueryCache(queryClient: QueryClient) {
	const ids = get(checkedEntryIds);

	const cached = queryClient.getQueriesData<InfiniteData<QueryOutput<'get_library'>>>({
		queryKey: ['entries', 'list']
	});

	const entries = cached.flatMap((page) => page[1]?.pages ?? []).flatMap(({ entries }) => entries);

	return entries.filter((entry) => ids.includes(entry.id));
}
