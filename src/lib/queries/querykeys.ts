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
import type { RequireAtLeastOne } from 'type-fest';

type Meta = Record<string, unknown> | undefined;
type QueryFnParams = {
	meta: Meta;
};

type InfiniteQueryFnParams = {
	meta: Meta;
	// TODO: fix types for queryFactory
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	pageParam: any;
};

type SimplifiedQuery<TData> = {
	queryFn: (params: QueryFnParams) => Promise<TData>;
	queryKey: Array<string>;
};

export function getQueryContext(queryClient: QueryClient) {
	// expects passed in opts from queryFactory
	// TODO: this isn't a perfect solution because doesn't respect 4 types of query
	function getData<TData, TOpts extends SimplifiedQuery<TData>>(opts: TOpts) {
		const { queryKey } = opts;
		return queryClient.getQueryData<Awaited<ReturnType<TOpts['queryFn']>>>(
			queryKey,
		);
	}

	return {
		getData,
	};
}

function addAuthorsToQueryClient(queryClient: QueryClient, _authors: string[]) {
	const authors = queryClient.getQueryData<QueryOutput<'get_authors'>>([
		'entries',
		'authors',
	]);
	// if authors is undefined, it hasn't been fetched yet... so don't worry about it
	if (authors) {
		for (const author of _authors) {
			if (!authors.includes(author)) {
				console.log('adding author', author);
				authors.push(author);
			}
		}
		queryClient.setQueryData(['entries', 'authors'], authors);
	}
}

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
		/** Gets all the entries in the current user's library. */
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

		detail: (input: QueryInput<'entry_by_id'>, queryClient?: QueryClient) => ({
			queryFn: async ({ meta }: QueryFnParams) => {
				const entry = await qquery(meta?.init, 'entry_by_id', input);
				if (queryClient) {
					if (entry.author) {
						addAuthorsToQueryClient(queryClient, [entry.author]);
					}
				}
				return entry;
			},
			queryKey: ['entries', 'detail', { input }] as const,
		}),
		// list
		list: (input?: QueryInput<'get_library'>, queryClient?: QueryClient) => ({
			getNextPageParam(lastPage) {
				return (lastPage as QueryOutput<'get_library'>).nextCursor;
			},

			initialPageParam: null as QueryOutput<'get_library'>['nextCursor'],

			queryFn: async ({ meta, pageParam }: InfiniteQueryFnParams) => {
				const entries = await qquery(
					meta?.init,
					'get_library',
					input
						? { ...input, cursor: pageParam }
						: { cursor: pageParam, status: 'Backlog' },
				);

				// push authors to authors list (this will automatically update the authors query when this changes)
				if (queryClient) {
					addAuthorsToQueryClient(
						queryClient,
						entries.entries
							.map((e) => e.bookmark_author || e.author)
							.filter(Boolean),
					);
				}

				return entries;
			},
			// Ideally entries, list would get inferred... but this will do for  now
			queryKey: ['entries', 'list', input ? input : undefined] as const,

			// staleTime: 1000 * 5, // 5 seconds
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
					dir: 'desc',
					orderBy: 'createdAt',
					...input,
					cursor: pageParam,
				});
				// "push" approach to seeding cache. TODO look at perf impact
				// see https://tkdodo.eu/blog/seeding-the-query-cache#push-approach
				if (queryClient) {
					data.notes.forEach((note) => {
						// should match query key below
						queryClient.setQueryData(
							['notes', 'detail', { id: note.id }],
							note,
						);
					});
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
	subscriptions: {
		all: () => ({
			queryFn: ({ meta }: QueryFnParams) =>
				qquery(meta?.init, 'list_subscriptions', {}),
			queryKey: ['subscriptions'],
		}),
		detail: (input: QueryInput<'subscription'>) => ({
			queryFn: ({ meta }: QueryFnParams) =>
				qquery(meta?.init, 'subscription', input),
			queryKey: ['subscription', input.feedId],
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
	viewPreferences: {
		getOrCreate: (input: QueryInput<'viewPreferencesGetOrCreate'>) => ({
			queryFn: ({ meta }: QueryFnParams) =>
				qquery(meta?.init, 'viewPreferencesGetOrCreate', input),
			queryKey: ['viewPreferences', { input }] as const,
		}),
	},
} satisfies TQueryFactory;

export type QueryFactory = typeof queryFactory;

type TQueryFactory = Record<
	string,
	Record<
		string,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(...args: Array<any>) => CreateQueryOptions | CreateInfiniteQueryOptions
	>
>;
