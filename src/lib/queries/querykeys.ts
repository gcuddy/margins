/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {
	type CreateInfiniteQueryOptions,
	type CreateQueryOptions,
	keepPreviousData,
	type QueryClient,
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
	collections: {
		list: (input?: QueryInput<'collections'>) => ({
			getNextPageParam(lastPage) {
				return (lastPage as QueryOutput<'collections'>).nextCursor;
			},
			initialPageParam: null as QueryOutput<'collections'>['nextCursor'],
			placeholderData: keepPreviousData,
			queryFn: ({ meta, pageParam }: InfiniteQueryFnParams) =>
				qquery(meta?.init, 'collections', { ...input, cursor: pageParam }),
			queryKey: ['collections', 'list'] as const,
			staleTime: input ? 1000 * 60 * 5 : Number.POSITIVE_INFINITY,
		}),
	},
	entries: {
		all: () => ({
			queryFn: ({ meta }: QueryFnParams) =>
				qquery(meta?.init, 'getAllEntries', {}),
			queryKey: ['entries', 'all'] as const,
			staleTime: Number.POSITIVE_INFINITY,
		}),

		authors: () => ({
			queryFn: ({ meta }: QueryFnParams) =>
				qquery(meta?.init, 'get_authors', {}),
			queryKey: ['entries', 'authors'] as const,
			staleTime: Number.POSITIVE_INFINITY,
		}),

		count: (input: QueryInput<'count_library'>) => ({
			queryFn: ({ meta }: QueryFnParams) =>
				qquery(meta?.init, 'count_library', input),
			queryKey: ['entries', 'count', { input }] as const,
		}),

		detail: (input: QueryInput<'entry_by_id'>) => ({
			queryFn: ({ meta }: QueryFnParams) =>
				qquery(meta?.init, 'entry_by_id', input),
			queryKey: ['entries', 'detail', { input }] as const,
		}),
		// list
		list: (input?: QueryInput<'get_library'>) => ({
			getNextPageParam(lastPage) {
				return (lastPage as QueryOutput<'get_library'>).nextCursor;
			},

			initialPageParam: null as QueryOutput<'get_library'>['nextCursor'],

			queryFn: ({ meta, pageParam }: InfiniteQueryFnParams) => {
				return qquery(
					meta?.init,
					'get_library',
					input
						? { ...input, cursor: pageParam }
						: { cursor: pageParam, status: 'Backlog' },
				);
			},
			// Ideally entries, list would get inferred... but this will do for  now
			queryKey: ['entries', 'list', input ? input : undefined] as const,
		}),
		search: (input: QueryInput<'search_titles'>) => ({
			queryFn: ({ meta }: QueryFnParams) =>
				qquery(meta?.init, 'search_titles', input),
			queryKey: ['entries', 'search', { input }] as const,
		}),
	},
	links: {
		href: (hrefs: Array<string>) => ({
			placeholderData: keepPreviousData,
			queryFn: async () => {
				const $page = get(page);
				const res = await fetch(`${$page.url.origin}/api/links`, {
					body: JSON.stringify(hrefs),
					headers: {
						'Content-Type': 'application/json',
					},
					method: 'POST',
				});
				if (!res.ok) {
					throw new Error('Failed to fetch link metadata');
				}
				const data = await res.json();
				return data as Array<{ href: string; title: string }>;
			},
			queryKey: ['links', hrefs] as const,
			staleTime: Number.POSITIVE_INFINITY,
		}),
	},
	notes: {
		detail: (input: QueryInput<'note'>) => {
			// const queryClient = useQueryClient();
			return {
				queryFn: ({ meta }: QueryFnParams) => qquery(meta?.init, 'note', input),
				queryKey: ['notes', 'detail', input] as const,
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
		},
		list: (input?: QueryInput<'notes'>, queryClient?: QueryClient) => ({
			getNextPageParam(lastPage) {
				return (lastPage as QueryOutput<'notes'>).nextCursor;
			},
			initialPageParam: undefined as QueryOutput<'notes'>['nextCursor'],
			queryFn: async ({ meta, pageParam }: InfiniteQueryFnParams) => {
				const data = await qquery(meta?.init, 'notes', {
					...input,
					cursor: pageParam,
				});
				// "push" approach to seeding cache. TODO look at perf impact
				// see https://tkdodo.eu/blog/seeding-the-query-cache#push-approach
				if (queryClient) {
					console.log('pushing notes detail cache from list');
					console.time('push notes');
					data.notes.forEach((note) => {
						// should match query key below
						queryClient.setQueryData(
							['notes', 'detail', { id: note.id }],
							note,
						);
					});
					console.timeEnd('push notes');
				}

				return data;
			},
			queryKey: ['notes', 'list', input] as const,
		}),
		search: (input: QueryInput<'searchNotes'>) => ({
			placeholderData: keepPreviousData,
			queryFn: ({ meta }: QueryFnParams) =>
				qquery(meta?.init, 'searchNotes', input),
			queryKey: ['notes', 'search', { input }] as const,
		}),
	},
	pins: {
		list: () => ({
			// staleTime: Infinity, // stale until invalidated
			placeholderData: keepPreviousData,

			queryFn: ({ meta }: QueryFnParams) => qquery(meta?.init, 'pins', {}),

			queryKey: ['pins', 'list'] as const,
		}),
	},
	search: {
		books: (input: QueryInput<'searchBooks'>) => ({
			placeholderData: keepPreviousData,
			queryFn: ({ meta }: QueryFnParams) =>
				qquery(meta?.init, 'searchBooks', input),
			queryKey: ['search', 'books', { input }] as const,
		}),
		movies: (input: QueryInput<'searchMovies'>) => ({
			placeholderData: keepPreviousData,
			queryFn: ({ meta }: QueryFnParams) =>
				qquery(meta?.init, 'searchMovies', input),
			queryKey: ['search', 'movies', { input }] as const,
		}),
	},
	tags: {
		list: () => ({
			placeholderData: keepPreviousData,
			queryFn: ({ meta }: QueryFnParams) => qquery(meta?.init, 'tags', {}),
			queryKey: ['tags', 'list'] as const,
			staleTime: Number.POSITIVE_INFINITY,
		}),
	},
} satisfies TQueryFactory;

export type QueryFactory = typeof queryFactory;

type TQueryFactory = Record<
	string,
	Record<
		string,
		(...args: Array<any>) => CreateQueryOptions | CreateInfiniteQueryOptions
	>
>;

type QueryFn = <T extends {}>(
	input: T,
) => T extends { cursor: any }
	? CreateInfiniteQueryOptions
	: CreateQueryOptions;
