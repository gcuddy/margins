import { createQueryKeyStore } from '@lukemorales/query-key-factory';
import {
	keepPreviousData,
	type CreateInfiniteQueryOptions,
	type CreateQueryOptions,
	type QueryClient,
	type QueryMeta,
	type createInfiniteQuery,
	useQueryClient
} from '@tanstack/svelte-query';
import { qquery, type QueryInput, Queries, QueryOutput } from './query';

export const queries = createQueryKeyStore({
	entries: {
		// list, detail
		// or should this be "library"?
		list: (filters: QueryInput<'get_library'>) => ({
			queryKey: [{ filters }],
			queryFn: ({ queryKey, meta }) => {}
		})
	}
});

// function createQueryOptions<TFn extends keyof Queries>(fn: TFn, input: QueryInput<TFn>) {
//     return queryOptions<QueryOutput<TFn>, DefaultError, QueryOutput<TFn>, TypedQueryKey<TFn>>({
//         queryKey: getArrayQueryKey(fn, input),
//         queryFn: ({ queryKey, meta }) => qquery($page, queryKey[0][0], queryKey[1].input)
//     });
// }

// very simplified bastardized version of this for our purposes...
type QueryFnParams = {
	meta: any;
};

type InfiniteQueryFnParams = {
	meta: any;
	pageParam: any;
};

export const queryFactory = {
	entries: {
		all: () => ({
			queryKey: ['entries'] as const,
			queryFn: ({ meta }: QueryFnParams) => qquery(meta?.init, 'getAllEntries', {}),
			staleTime: Infinity
		}),
		// list
		list: (input?: QueryInput<'get_library'>) => ({
			// Ideally entries, list would get inferred... but this will do for  now
			queryKey: ['entries', 'list', input ? input : undefined] as const,
			queryFn: ({ meta, pageParam }: InfiniteQueryFnParams) => {
				console.log({ meta, pageParam });
				console.log(`running queryFn for entries.list`);
				return qquery(
					meta?.init,
					'get_library',
					input ? { ...input, cursor: pageParam } : { status: 'Backlog', cursor: pageParam }
				);
			},
			getNextPageParam(lastPage) {
				console.log({ lastPage });
				return (lastPage as QueryOutput<'get_library'>)?.nextCursor;
			},
			defaultPageParam: <QueryOutput<'get_library'>['nextCursor']>null
		}),
		detail: (input: QueryInput<'entry_by_id'>) => ({
			queryKey: ['entries', 'detail', { input }] as const,
			queryFn: ({ meta }: QueryFnParams) => qquery(meta?.init, 'entry_by_id', input)
		}),
		search: (input: QueryInput<'search_titles'>) => ({
			queryKey: ['entries', 'search', { input }] as const,
			queryFn: ({ meta }: QueryFnParams) => qquery(meta?.init, 'search_titles', input)
		}),
		count: (input: QueryInput<'count_library'>) => ({
			queryKey: ['entries', 'count', { input }] as const,
			queryFn: ({ meta }: QueryFnParams) => qquery(meta?.init, 'count_library', input)
		}),
		authors: () => ({
			queryKey: ['entries', 'authors'] as const,
			queryFn: ({ meta }: QueryFnParams) => qquery(meta?.init, 'get_authors', {}),
			staleTime: Infinity
		})
	},
	tags: {
		list: () => ({
			queryKey: ['tags', 'list'] as const,
			queryFn: ({ meta }: QueryFnParams) => qquery(meta?.init, 'tags', {}),
			staleTime: Infinity,
			placeholderData: keepPreviousData
		})
	},
	notes: {
		list: (input?: QueryInput<'notes'>, queryClient?: QueryClient) => ({
			queryKey: ['notes', 'list', input] as const,
			queryFn: async ({ meta }: QueryFnParams) => {
                const data = await qquery(meta?.init, 'notes', { ...input });
                // "push" approach to seeding cache. TODO look at perf impact
                // see https://tkdodo.eu/blog/seeding-the-query-cache#push-approach
                if (queryClient) {
                    console.log('pushing notes detail cache from list')
                    console.time('push notes')
                    data.notes.forEach(note => {
                        // should match query key below
                        queryClient.setQueryData(['notes', 'detail', { id: note.id}], note)
                    })
                    console.timeEnd('push notes')
                }

                return data;
            }
		}),
		detail: (input: QueryInput<'note'>) => {
			const queryClient = useQueryClient();
			return {
				queryKey: ['notes', 'detail', input] as const,
				queryFn: ({ meta }: QueryFnParams) => qquery(meta?.init, 'note', input),
                // Failed "Pull" approach  - tricky to use getqueriesdata and then also get the date from the query
				// initialData: () => {
				// 	const queries = queryClient.getQueriesData({
				// 		queryKey: ['notes', 'list']
				// 	}) as [string[], QueryOutput<'notes'>][];
				// 	for (const [key, data] of queries) {
				// 		console.log({ key, data });
				// 		const state = queryClient.getQueryState(key);
				// 		console.log({ state });
				// 	}
				// 	const notes = queries.flatMap(([key, data]) => data.notes);
				// 	const note = notes.find((n) => n.id === input.id);
				// 	if (note) {
				// 		console.log('found initial data');
				// 	}
				// 	return note;
				// }
			};
		}
	},
	pins: {
		list: () => ({
			queryKey: ['pins', 'list'] as const,
			queryFn: ({ meta }: QueryFnParams) => qquery(meta?.init, 'pins', {}),
			// staleTime: Infinity, // stale until invalidated
			placeholderData: keepPreviousData
		})
	}
} satisfies TQueryFactory;

export type QueryFactory = typeof queryFactory;

type TQueryFactory = {
	[key: string]: {
		// TODO: make this use createinfinte when input extends { cursor }
		[subkey: string]: (...args: any[]) => CreateQueryOptions | CreateInfiniteQueryOptions;
		// [subkey: string]: QueryFn;
	};
};

type QueryFn = <T extends {}>(
	input: T
) => T extends { cursor: any } ? CreateInfiniteQueryOptions : CreateQueryOptions;
