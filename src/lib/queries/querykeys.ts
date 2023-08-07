import { createQueryKeyStore } from '@lukemorales/query-key-factory';
import type {
	CreateInfiniteQueryOptions,
	CreateQueryOptions,
	QueryClient,
	QueryMeta,
	createInfiniteQuery
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
		// list
		list: (filters?: QueryInput<'get_library'>) => ({
			// Ideally entries, list would get inferred... but this will do for  now
			queryKey: ['entries', 'list', filters ? { filters } : undefined] as const,
			queryFn: ({ meta, pageParam }: InfiniteQueryFnParams) =>
				qquery(
					meta?.init,
					'get_library',
					filters ? { ...filters, cursor: pageParam } : { status: 'Backlog', cursor: pageParam }
				),
			getNextPageParam(lastPage) {
				return (lastPage as QueryOutput<'get_library'>).nextCursor;
			},
			defaultPageParam: <QueryOutput<'get_library'>['nextCursor']>null
		}),
		detail: (input: QueryInput<'entry_by_id'>) => ({
			queryKey: ['entries', 'detail', { input }] as const,
			queryFn: ({ meta }: QueryFnParams) => qquery(meta?.init, 'entry_by_id', input)
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

function createFn<TKey extends keyof Queries>(
	input: TKey,
	opts: QueryInput<TKey> extends { cursor: any } ? CreateInfiniteQueryOptions : CreateQueryOptions
): QueryInput<TKey> extends { cursor: any } ? CreateInfiniteQueryOptions : CreateQueryOptions {
	return (input: QueryInput<TKey>) => {};
}

createFn(
	{ cursor: 1 },
	{
		initialData: []
	}
);
