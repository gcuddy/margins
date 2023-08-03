import { createQueryKeyStore } from '@lukemorales/query-key-factory';
import { qquery, type QueryInit, type QueryInput } from './query';
import { createQuery, type CreateQueryOptions } from '@tanstack/svelte-query';

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

export const queryFactory = {
	entries: {
		// list
		list: (filters: QueryInput<'get_library'>) => {
			return {
				// Ideally entries, list would get inferred... but this will do for  now
				queryKey: ['entries', 'list', { filters }] as const,
				queryFn: ({ queryKey, meta }) => qquery(meta?.init, 'get_library', filters)
			};
		},
		detail: (input: QueryInput<'entry_by_id'>) => ({
			queryKey: ['entries', 'detail', { input }] as const,
			queryFn: ({ queryKey, meta }) => qquery(meta?.init, 'entry_by_id', input)
		})
	}
} satisfies TQueryFactory;

export type QueryFactory = typeof queryFactory;


type Q = Parameters<typeof createQuery>[0];

type TQueryFactory = {
	[key: string]: {
		[subkey: string]: (...args: any[]) => CreateQueryOptions;
	};
};

