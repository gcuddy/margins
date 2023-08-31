// lightweight home built query manager ala React Query

import type {
	CreateInfiniteQueryOptions,
	CreateQueryOptions,
	DefaultError,
} from '@tanstack/svelte-query';
import { stringify } from 'devalue';
import type { Session, User } from 'lucia';
import { derived, type Readable, writable } from 'svelte/store';
import { get } from 'svelte/store';
import type { z } from 'zod';

import { page } from '$app/stores';

import type {
	Mutations,
	Queries,
} from '../../routes/tests/(app2)/queries.server';
import { queryOptions } from './utils';

export type { Queries };

export type IsAny<T> = 0 extends 1 & T ? true : false;

const query_store_cache_lookup = new Map<string, any>();

export type QueryInput<TKey extends keyof Queries> = Parameters<
	Queries[TKey]['fn']
>[0]['input'] extends IsAny<Parameters<Queries[TKey]['fn']>[0]['input']>
	? undefined
	: Parameters<Queries[TKey]['fn']>[0]['input'];
export type QueryOutput<TKey extends keyof Queries> = Awaited<
	ReturnType<Queries[TKey]['fn']>
>;
export type MutationInput<TKey extends keyof Mutations> = Parameters<
	Mutations[TKey]['fn']
>[0]['input'] extends IsAny<Parameters<Mutations[TKey]['fn']>[0]['input']>
	? undefined
	: Parameters<Mutations[TKey]['fn']>[0]['input'];

// https://stackoverflow.com/questions/62185345/use-keyof-to-extract-a-string-literal-union-of-only-keys-that-have-values-of-a-s
type KeysMatching<T, V> = {
	[K in keyof T]-?: T[K] extends V ? K : never;
}[keyof T];

// Cursor Keys
export type InfiniteQueries = {
	[K in keyof Queries]: Parameters<Queries[K]['fn']>[0]['input'] extends {
		cursor?: any;
	}
		? K
		: never;
}[keyof Queries];

export type QueryInit = {
	data?: {
		session?: Session | null;
		user?: User | null;
		userId?: string | null;
	} | null;
	fetch?: typeof globalThis.fetch;
	fetcher?: typeof fetch;
	url?: URL;
	userId?: string | null;
};

// https://stackoverflow.com/questions/67605122/obtain-a-slice-of-a-typescript-parameters-tuple
type ParametersExceptFirst<F> = F extends (arg0: any, ...rest: infer R) => any
	? R
	: never;

export function queryCaller(page: Readable<Record<string, string>>) {
	let $page: Record<string, string>;
	const unsubPage = page.subscribe((v) => ($page = v));
	type Params = ParametersExceptFirst<typeof query>;

	const store = derived(page, ($page) => {
		return async function _query<T extends keyof Queries>(
			fn: T,
			input: Parameters<Queries[T]['fn']>[0]['input'] extends IsAny<
				Parameters<Queries[T]['fn']>[0]['input']
			>
				? undefined
				: Parameters<Queries[T]['fn']>[0]['input'],
			options?: {
				cache?: boolean;
				enabled?: boolean;
				stale_time?: number;
			},
		): Promise<Awaited<ReturnType<Queries[T]['fn']>>> {
			return query($page, fn, input, options);
		};
	});
	return store;

	// return async function query<T extends keyof Queries>(...args) {};
}

// taken from https://github.com/vishalbalaji/trpc-svelte-query-adapter/blob/main/src/index.ts

// getQueryKey
type QueryType = 'query' | 'infinite';

type QueryKey = [
	Array<string>,
	{ input?: unknown; type?: Exclude<QueryType, 'any'> }?,
];

export type TypedQueryKey<T extends keyof Queries> = [
	[T],
	{
		input: QueryInput<T>;
		type?: T extends InfiniteQueries ? QueryType : 'query';
	},
];

// TODO: allow input to be undefined
export function getArrayQueryKey<T extends keyof Queries>(
	queryKey: T,
	input: QueryInput<T>,
	type?: T extends InfiniteQueries ? QueryType : 'query',
): TypedQueryKey<T> {
	return [
		[queryKey],
		{
			input,
			// ...(typeof input !== 'undefined' && { input: input }),
			...(!type ? { type: 'query' } : { type: type }),
		},
	];

	// const arrayPath = (
	// 	typeof queryKey === 'string' ? (queryKey === '' ? [] : queryKey.split('.')) : queryKey
	// ) as [string];

	// if (!input && (!type || type === 'any'))
	// 	// for `utils.invalidate()` to match all queries (including vanilla react-query)
	// 	// we don't want nested array if path is empty, i.e. `[]` instead of `[[]]`
	// 	return arrayPath.length ? [arrayPath] : ([] as unknown as QueryKey);

	// return [
	// 	arrayPath,
	// 	{
	// 		...(typeof input !== 'undefined' && { input: input }),
	// 		...(type && type !== 'any' && { type: type })
	// 	}
	// ];
}

type GetQueryType<T> = T extends InfiniteQueries
	? 'infinite' | 'query'
	: 'query';

type CursorType<T extends keyof Queries> = T extends InfiniteQueries
	? Parameters<Queries[T]['fn']>[0]['input']['cursor']
	: undefined;
// : TType extends 'infinite'
// 	? (
//         init: Parameters<typeof query<T>>[0],
//         input: Parameters<typeof query<T>>[2]
//   ) => CreateInfiniteQueryOptions
// : (
//     init: Parameters<typeof query<T>>[0],
//     input: Parameters<typeof query<T>>[2]
// ) => CreateQueryOptions
export function createQueryOption<
	T extends keyof Queries,
	TType extends GetQueryType<T>,
>(fn: T, type: TType = 'query' as TType) {
	type Params = Parameters<typeof query<T>>;

	type Input = Params[2];

	// get array query

	type TOutput = QueryOutput<T>;

	return function queryOption(init: Params[0], input: Params[2]) {
		if (type === 'infinite') {
			// todo
			return {
				getNextPageParam: (lastPage) => (lastPage as any).nextCursor,
				initialPageParam: undefined as CursorType<T>,
				queryFn: ({ pageParam }) =>
					query(init, fn, {
						...input,
						cursor: pageParam,
					}),
				queryKey: getArrayQueryKey(fn, input, type),
			} satisfies CreateInfiniteQueryOptions;
		}
		return {
			queryFn: () => query(init, fn, input),
			queryKey: getArrayQueryKey(fn, input, type),
		} satisfies CreateQueryOptions;
	};
}

type Params<T extends keyof Queries> = Parameters<
	Queries[T]['fn']
>[0]['input'] extends IsAny<Parameters<Queries[T]['fn']>[0]['input']>
	? undefined
	: Parameters<Queries[T]['fn']>[0]['input'];

export function queryOpts<T extends keyof Queries>(
	init: QueryInit,
	fn: T,
	params: Parameters<Queries[T]['fn']>[0]['input'],
): CreateQueryOptions<
	QueryOutput<T>,
	DefaultError,
	QueryOutput<T>,
	TypedQueryKey<T>
>;
export function queryOpts<T extends keyof Queries>(
	fn: T,
	params: Parameters<Queries[T]['fn']>[0]['input'],
): CreateQueryOptions<
	QueryOutput<T>,
	DefaultError,
	QueryOutput<T>,
	TypedQueryKey<T>
>;
export function queryOpts<T extends keyof Queries>(
	initOrFn: T | QueryInit,
	paramsOrFn: T | Parameters<Queries[T]['fn']>[0]['input'],
	params?: Parameters<Queries[T]['fn']>[0]['input'],
): CreateQueryOptions<
	QueryOutput<T>,
	DefaultError,
	QueryOutput<T>,
	TypedQueryKey<T>
> {
	if (typeof initOrFn === 'string') {
		const fn = initOrFn;
		const params = paramsOrFn as Parameters<Queries[T]['fn']>[0]['input'];
		return queryOptions({
			queryFn: () => query({}, fn, params),
			queryKey: getArrayQueryKey(fn, params, 'query'),
		});
	}
	const init = initOrFn;
	const fn = paramsOrFn as T;
	return queryOptions({
		queryFn: () => query(init, fn, params),
		queryKey: getArrayQueryKey(fn, params, 'query'),
	});
}

export async function query<T extends keyof Queries>(
	// allow for a base to be passed in that could be unknown
	base: any | QueryInit | Record<string, unknown>,
	fn: T,
	input: Parameters<Queries[T]['fn']>[0]['input'] extends IsAny<
		Parameters<Queries[T]['fn']>[0]['input']
	>
		? undefined
		: Parameters<Queries[T]['fn']>[0]['input'],
	options?: {
		cache?: boolean;
		enabled?: boolean;
		stale_time?: number;
	},
): Promise<Awaited<ReturnType<Queries[T]['fn']>>> {
	if (options) {
		if (options.stale_time) {
			// todo
		}
		// if (options.enabled === false) {
		//     return;
		// }
	}
	type Data = Awaited<ReturnType<Queries[T]['fn']>>;
	console.log(`running query ${fn}`, new Date());
	console.log({ input });
	const init = (base || {}) as QueryInit;
	console.log({ init });
	let { fetcher, userId } = init;
	console.log({ init, userId });
	userId =
		userId ||
		init.data?.userId ||
		init.data?.session?.user.userId ||
		init.data?.user?.userId ||
		null;
	fetcher = init.fetch || fetcher || fetch;
	console.log({ fetcher });
	const data = stringify(input);
	console.log({ data });
	let url = `${
		init.url?.origin ?? ''
	}/tests/sq/${fn}?input=${encodeURIComponent(data)}`;
	if (userId) {
		url += `&userId=${userId}`;
	}
	if (options) {
		if (options.cache) {
			// TODO: stale time (wil require caching lookup time)
			if (query_store_cache_lookup.has(url)) {
				return query_store_cache_lookup.get(url) as Data;
			}
		}
	}
	const response = await fetcher(url);
	if (!response.ok) {
		throw new Error(response.statusText);
	}
	const final = (await response.json()) as Awaited<Data>;
	if (options?.cache) {
		query_store_cache_lookup.set(url, final);
	}
	return final;
}

export { query as qquery };

export const isMutating = writable(false);

/**
 * Helper function to run a mutation
 * @param fn Mutation operation to run
 * @param input Input to pass to mutation
 * @returns Data returned from mutation
 */
export async function mutate<TMutation extends keyof Mutations>(
	fn: TMutation,
	input: Mutations[TMutation]['schema'] extends z.ZodTypeAny
		? undefined
		: z.input<NonNullable<Mutations[TMutation]['schema']>>,
): Promise<Awaited<ReturnType<Mutations[TMutation]['fn']>>> {
	const $page = get(page);
	return mutation($page, fn, input);
}

export async function mutation<T extends keyof Mutations>(
	base:
		| {
				fetcher?: typeof fetch;
				url: URL;
				userId?: string | null;
		  }
		| any,
	fn: T,
	input: Mutations[T]['schema'] extends z.ZodTypeAny
		? undefined
		: z.input<NonNullable<Mutations[T]['schema']>>,
	opts?: Partial<{
		fetcher: typeof fetch;
		userId: string | null;
	}>,
): Promise<Awaited<ReturnType<Mutations[T]['fn']>>> {
	isMutating.set(true);
	const { fetcher = fetch, userId = null } = base || {};
	console.log(`mutating`);
	let url = `${base?.url?.origin}/tests/sq/${fn}`;
	if (userId) {
		url += `&userId=${userId}`;
	}
	type Data = Awaited<ReturnType<Mutations[T]['fn']>>;
	console.log({ url });
	const response: Response = await fetcher(url, {
		body: stringify({
			input,
			userId,
		}),
		method: 'POST',
	});
	isMutating.set(false);
	if (!response.ok) {
		throw new Error(response.statusText);
	}
	const final = (await response.json()) as Awaited<Data>;
	return final;
}

type Fn = keyof Queries;

// function fetch_api(fn: Fn) {
//     query
// }

// cache lookup is going to look like a map with a query key and the stored data.

// whenevr a query is made, its key is looked up in the cache and if it exists, it is returned

export class Query {
	private url: URL;
	private fetcher: typeof fetch;
	private userId: string | null;

	constructor(init: {
		fetcher?: typeof fetch;
		url: URL;
		userId?: string | null;
	}) {
		this.url = init.url;
		this.fetcher = init.fetcher || fetch;
		this.userId = init.userId || null;
	}

	// // tried to have this return query_store and disaster ensued
	// async query<T extends keyof Queries>(
	// 	fn: T,
	// 	input: Parameters<Queries[T]['fn']>[0]['input'] extends IsAny<
	// 		Parameters<Queries[T]['fn']>[0]['input']
	// 	>
	// 		? undefined
	// 		: Parameters<Queries[T]['fn']>[0]['input'],
	// 	opts?: Partial<{
	// 		fetcher: typeof fetch;
	// 		userId: string | null;
	// 		debounce: number;
	// 	}>
	// ): Promise<Awaited<ReturnType<Queries[T]['fn']>>> {
	// 	console.log('running query', new Date());
	// 	const { debounce } = opts || {};
	// 	const { fetcher = fetch, userId = null } = this || {};
	// 	const data = stringify(input);
	// 	let url = this.url.origin + `/tests/sq/${fn}?input=${data}`;
	// 	if (userId) {
	// 		url += `&userId=${userId}`;
	// 	}
	// 	type Data = Awaited<ReturnType<Queries[T]['fn']>>;
	// 	// if (query_store_cache_lookup.has(url)) {
	// 	//     return query_store_cache_lookup.get(url) as Data;
	// 	// }
	// 	console.log({ url });
	// 	const final = (await fetcher(url).then((res) => res.json())) as Awaited<Data>;
	// 	query_store_cache_lookup.set(url, final);
	// 	return final;
	// }
}

export function q(init: {
	fetcher?: typeof fetch;
	url: URL;
	userId?: string | null;
}) {
	const query = new Query(init);

	console.log({ query });

	return query;
}

export function query_store<T>(opts: {
	fn: () => Promise<T>;
	// fn: Fn
	staleTime: number;
}): Readable<{
	data: T | null;
	loading: boolean;
}> {
	// function that returns a store,
	// which is a proxy that returns a promise
	// that resolves to the value of the query
	// and caches the value for a given time
	// and updates the cache when the query is called again

	let data_updated_timestamp: number | null = null;

	// const _fn = query(opts.fn, {})

	const loading = true;

	const store = writable<{
		data: T | null;
		loading: boolean;
	}>({
		data: null,
		loading: true,
	});

	async function get() {
		// run fn and put it in data
		store.update((value) => ({ ...value, loading: true }));
		const data = await opts.fn();
		data_updated_timestamp = Date.now();
		store.set({ data, loading: false });
	}

	function subscribe() {
		return store.subscribe((new_value) => {
			// if stale time, run get
			if (
				data_updated_timestamp === null ||
				Date.now() - data_updated_timestamp > opts.staleTime
			) {
				// get()
			}
		});
	}

	return {
		subscribe,
	};
}

export const sq = (
	init: {
		fetcher?: typeof fetch;
		url: URL;
		userId?: string | null;
	},
	ctx?: {
		userId?: string | null;
	},
) => {
	return {
		query: async function query<T extends keyof Queries>(
			fn: T,
			input: Parameters<Queries[T]['fn']>[0]['input'],
		): Promise<Awaited<ReturnType<Queries[T]['fn']>>> {
			const { fetcher = fetch, userId = null } = init || {};
			const data = stringify(input);
			let url = init.fetcher
				? ''
				: `${init.url.origin}/tests/sq/${fn}?input=${data}`;
			if (userId) {
				url += `&userId=${userId}`;
			}
			type Data = Awaited<ReturnType<Queries[T]['fn']>>;
			const final = (await fetcher(url).then((res) =>
				res.json(),
			)) as Awaited<Data>;
			return final;
		},
	};
};

// sq().query
// sq({}).query("tags")

//
// sq(init).query("tags")
// => returns query_store

// export const sq = (init?: RequestEvent, ctx?: {
//     userId?: string | null;
// }) => {
//     // return an object with all the queries, where calling them calls our query helper function fully typed
//     return Object.fromEntries(Object.entries(queries).map(([key, value]) => {
//         return [
//             key,
//             (input: Parameters<typeof value.fn>["0"]["input"], staleTime = 0) => {
//                 return query_store({
//                     fn: () => query(key as Fn, input),
//                     staleTime
//                 } as const)
//             }
//         ] as const
//     }))
// }

function base_query_store() {
	// create base query store that has all the queries
	// sets gets context
}

// usage: sq().tags({}) => returns query_store
