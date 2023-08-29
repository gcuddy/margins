/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {
	type CreateInfiniteQueryOptions,
	type CreateQueryOptions,
	keepPreviousData,
	type QueryClient
} from '@tanstack/svelte-query';
import { get } from 'svelte/store';

import { page } from '$app/stores';

import { qquery, type QueryInput, type QueryOutput } from './query';


type Meta = Record<string, unknown> | undefined;
type QueryFnParams = {
	meta: Meta;
};

type InfiniteQueryFnParams = {
	meta: Meta;
	pageParam: unknown;
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
				return qquery(
					meta?.init,
					'get_library',
					input ? { ...input, cursor: pageParam } : { status: 'Backlog', cursor: pageParam }
				);
			},
			getNextPageParam(lastPage) {
				return (lastPage as QueryOutput<'get_library'>).nextCursor;
			},
			initialPageParam: null as QueryOutput<'get_library'>['nextCursor']
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
			queryFn: async ({ meta, pageParam }: InfiniteQueryFnParams) => {
				const data = await qquery(meta?.init, 'notes', { ...input, cursor: pageParam });
				// "push" approach to seeding cache. TODO look at perf impact
				// see https://tkdodo.eu/blog/seeding-the-query-cache#push-approach
				if (queryClient) {
					console.log('pushing notes detail cache from list');
					console.time('push notes');
					data.notes.forEach((note) => {
						// should match query key below
						queryClient.setQueryData(['notes', 'detail', { id: note.id }], note);
					});
					console.timeEnd('push notes');
				}

				return data;
			},
			getNextPageParam(lastPage) {
				return (lastPage as QueryOutput<'notes'>).nextCursor;
			},
			initialPageParam: undefined as QueryOutput<'notes'>['nextCursor']
		}),
		detail: (input: QueryInput<'note'>) => {
			// const queryClient = useQueryClient();
			return {
				queryKey: ['notes', 'detail', input] as const,
				queryFn: ({ meta }: QueryFnParams) => qquery(meta?.init, 'note', input)
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
	},
	collections: {
		list: (input?: QueryInput<'collections'>) => ({
			queryKey: ['collections', 'list'] as const,
			queryFn: ({ meta, pageParam }: InfiniteQueryFnParams) =>
				qquery(meta?.init, 'collections', { ...input, cursor: pageParam }),
			staleTime: input ? 1000 * 60 * 5 : Infinity,
			placeholderData: keepPreviousData,
			getNextPageParam(lastPage) {
				return (lastPage as QueryOutput<'collections'>).nextCursor;
			},
			initialPageParam: null as QueryOutput<'collections'>['nextCursor']
		})
	},
    links: {
        href: (hrefs: Array<string>) => ({
            queryKey: ['links', hrefs] as const,
            queryFn: async () => {
                const $page = get(page);
                const res = await fetch(`${$page.url.origin}/api/links`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(hrefs)
                });
                if (!res.ok) {
                    throw new Error("Failed to fetch link metadata");
                }
                const data = await res.json();
                return data as Array<{title: string, href: string;}>
            },
            staleTime: Infinity,
            placeholderData: keepPreviousData
        })
    }
} satisfies TQueryFactory;

export type QueryFactory = typeof queryFactory;

type TQueryFactory = Record<string, Record<string, (...args: Array<any>) => CreateQueryOptions | CreateInfiniteQueryOptions>>;

type QueryFn = <T extends {}>(
	input: T
) => T extends { cursor: any } ? CreateInfiniteQueryOptions : CreateQueryOptions;
