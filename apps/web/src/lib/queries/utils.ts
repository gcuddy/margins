import {
	type QueryClient,
	createQuery,
	type CreateQueryOptions,
	type CreateQueryResult,
	type QueryKey,
	type DefinedCreateQueryResult,
	createInfiniteQuery,
	type CreateInfiniteQueryOptions,
	type CreateInfiniteQueryResult,
	type DefaultError,
	type InfiniteData,
	type WritableOrVal
} from '@tanstack/svelte-query';
import { writable } from 'svelte/store';
import type { QueryInit } from './query';

interface CreateServerQueryOptions<TOutput, TError> extends CreateQueryOptions<TOutput, TError> {
	ssr?: boolean;
}

export async function loadQuery<
	TOutput,
	TError,
	TFnOutput = TOutput,
	TQueryKey extends QueryKey = QueryKey
>(
	queryClient: QueryClient,
	opts: CreateQueryOptions<TOutput, TError, TFnOutput, TQueryKey> & {
		initialData?: undefined;
		queryKey: NonNullable<CreateQueryOptions['queryKey']>;
		ssr?: boolean;
	}
): Promise<() => DefinedCreateQueryResult<TFnOutput, TError>> {
	const { queryKey } = opts;
	const cache = queryClient.getQueryData(queryKey) as TOutput;
	if (!cache) {
		await queryClient.prefetchQuery(opts);
	}
	return () =>
		createQuery({
			...opts,
			initialData: cache,
			...(!cache
				? {
						refetchOnMount: opts.refetchOnMount ?? false
				  }
				: {})
		});
}
export async function loadInfiniteQuery<
	TQueryFnData = unknown,
	TError = unknown,
	TData = TQueryFnData,
	TQueryKey extends QueryKey = QueryKey
>(
	queryClient: QueryClient,
	opts: CreateInfiniteQueryOptions<
		TQueryFnData,
		TError,
		InfiniteData<TData>,
		TQueryFnData,
		TQueryKey
	> & {
		queryKey: NonNullable<CreateInfiniteQueryOptions['queryKey']>;
		ssr?: boolean;
	}
): Promise<() => CreateInfiniteQueryResult<InfiniteData<TData>, TError>> {
	const { queryKey } = opts;
	const cache = queryClient.getQueryData(queryKey) as TQueryFnData;
	console.log({ cache });
	if (opts.ssr !== false && !cache) {
		console.log('prefetching');
		await queryClient.prefetchInfiniteQuery(opts);
	}
	// TO CONSIDER: should we accept a writable store?
	return () =>
		createInfiniteQuery({
			...opts,
			// initialData: cache,
			...(!cache
				? {
						refetchOnMount: opts.refetchOnMount ?? false
				  }
				: {})
		});
}
export function createInfiniteQueryOptions<
	TQueryFnData = unknown,
	TError = unknown,
	TData = TQueryFnData,
	TQueryKey extends QueryKey = QueryKey
>(
	opts: CreateInfiniteQueryOptions<
		TQueryFnData,
		TError,
		InfiniteData<TData>,
		TQueryFnData,
		TQueryKey
	> & {
		queryKey: NonNullable<CreateInfiniteQueryOptions['queryKey']>;
		// ssr?: boolean;
	}
) {
	return opts;
}

/**
 * Type-safe wrapper around createInfiniteQuery that pre-fetches the query on the server, and returns a writable store that can be used to create an infinite query.
 * @param queryClient The query client to use
 * @param opts options for CreateInfiniteQueryOptions
 * @returns A writable store that can be used to create an infinite query
 */
export async function server_infinite_query<
	TQueryFnData = unknown,
	TError = unknown,
	TData = TQueryFnData,
	TQueryKey extends QueryKey = QueryKey
>(
	queryClient: QueryClient,
	opts: CreateInfiniteQueryOptions<
		TQueryFnData,
		TError,
		InfiniteData<TData>,
		TQueryFnData,
		TQueryKey
	> & {
		queryKey: NonNullable<CreateInfiniteQueryOptions['queryKey']>;
		// ssr?: boolean;
	}
) {
	const { queryKey } = opts;
	const cache = queryClient.getQueryData(queryKey) as TQueryFnData;
	if (!cache) {
		await queryClient.prefetchInfiniteQuery(opts);
	}
	return writable(opts);
}

export type UndefinedInitialDataOptions<
	TQueryFnData = unknown,
	TError = DefaultError,
	TData = TQueryFnData,
	TQueryKey extends QueryKey = QueryKey
> = CreateQueryOptions<TQueryFnData, TError, TData, TQueryKey> & {
	initialData?: undefined;
};

export type DefinedInitialDataOptions<
	TQueryFnData = unknown,
	TError = DefaultError,
	TData = TQueryFnData,
	TQueryKey extends QueryKey = QueryKey
> = CreateQueryOptions<TQueryFnData, TError, TData, TQueryKey> & {
	initialData: TQueryFnData | (() => TQueryFnData);
};

export function queryOptions<
	TQueryFnData = unknown,
	TError = DefaultError,
	TData = TQueryFnData,
	TQueryKey extends QueryKey = QueryKey,
	TOptions extends UndefinedInitialDataOptions<
		TQueryFnData,
		TError,
		TData,
		TQueryKey
	> = UndefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey>
>(options: TOptions): TOptions;

export function queryOptions<
	TQueryFnData = unknown,
	TError = unknown,
	TData = TQueryFnData,
	TQueryKey extends QueryKey = QueryKey,
	TOptions extends DefinedInitialDataOptions<
		TQueryFnData,
		TError,
		TData,
		TQueryKey
	> = DefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey>
>(
	options: TOptions
): TOptions;

export function queryOptions(options: unknown) {
	return options;
}

// alias - should be passed in to createquery meta
export type Meta = QueryInit;

type UndefinedInitialInfiniteDataOptions<
	TQueryFnData = unknown,
	TError = DefaultError,
	TData = TQueryFnData,
	TQueryKey extends QueryKey = QueryKey
> = CreateInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey> & {
	initialData?: undefined;
};

type DefinedInitialInfiniteDataOptions<
	TQueryFnData = unknown,
	TError = DefaultError,
	TData = TQueryFnData,
	TQueryKey extends QueryKey = QueryKey
> = CreateInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey> & {
	initialData: TQueryFnData | (() => TQueryFnData);
};

// export function infiniteQueryOptions<
//     TQueryFnData = unknown,
//     TError = unknown,
//     TData = TQueryFnData,
//     TQueryKey extends QueryKey = QueryKey
// >(
//     options: UndefinedInitialInfiniteDataOptions<TQueryFnData, TError, TData, TQueryKey>
// ): UndefinedInitialInfiniteDataOptions<TQueryFnData, TError, TData, TQueryKey>;

// export function infiniteQueryOptions<
//     TQueryFnData = unknown,
//     TError = unknown,
//     TData = TQueryFnData,
//     TQueryKey extends QueryKey = QueryKey
// >(
//     options: DefinedInitialInfiniteDataOptions<TQueryFnData, TError, TData, TQueryKey>
// ): DefinedInitialInfiniteDataOptions<TQueryFnData, TError, TData, TQueryKey>;
export function infiniteQueryOptions<
	TQueryFnData,
	TError = DefaultError,
	TData = InfiniteData<TQueryFnData>,
	TQueryKey extends QueryKey = QueryKey,
	TPageParam = unknown
>(
	options: WritableOrVal<
		CreateInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryFnData, TQueryKey, TPageParam>
	>
): WritableOrVal<
	CreateInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryFnData, TQueryKey, TPageParam>
>;

export function infiniteQueryOptions(options: unknown) {
	return options;
}
