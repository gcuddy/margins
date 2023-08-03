import {
	QueryInput,
	QueryOutput,
	TypedQueryKey,
	getArrayQueryKey,
	qquery
} from '$lib/queries/query';
import { UndefinedInitialDataOptions, queryOptions } from '$lib/queries/utils';
import type { CreateQueryOptions, DefaultError } from '@tanstack/svelte-query';
import type { Queries } from '../../routes/tests/(app2)/queries.server';
import type { Page } from '@sveltejs/kit';

// export function createQueryOptions<TFn extends keyof Queries>(
// 	init: Record<string, string>,
// 	fn: TFn,
// 	input: QueryInput<TFn>
// ): any;
// export function createQueryOptions<TFn extends keyof Queries>(fn: TFn, input: QueryInput<TFn>): any;
// export function createQueryOptions<TFn extends keyof Queries>(
// 	initOrFn: Record<string, string> | TFn,
// 	fnOrInput: TFn | QueryInput<TFn>,
// 	maybeInput?: QueryInput<TFn>
// ) {
//     const init = (typeof initOrFn === "string" ? {} : initOrFn) as Record<string, string>;
//     const fn = (typeof initOrFn === "string" ? initOrFn : fnOrInput) as TFn;
//     const input = (typeof initOrFn === "string" ? fnOrInput : maybeInput) as QueryInput<TFn>;

// 	return queryOptions<QueryOutput<TFn>, DefaultError, QueryOutput<TFn>, TypedQueryKey<TFn>>({
// 		queryKey: getArrayQueryKey(fn, input),
// 		queryFn: ({ queryKey }) => qquery(init, queryKey[0][0], queryKey[1].input)
// 	});
// }

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
>(options: TOptions): TOptions;

export function queryOptions(options: unknown) {
	return options;
}

export function createQueryOptions<
	TFn extends keyof Queries,
	TSelect = QueryOutput<TFn>,
	TOptions extends UndefinedInitialDataOptions<
		QueryOutput<TFn>,
		DefaultError,
		TSelect,
		TypedQueryKey<TFn>
	> = UndefinedInitialDataOptions<QueryOutput<TFn>, DefaultError, TSelect, TypedQueryKey<TFn>>
>(
	init: Record<string, string> | Page<Record<string, string>, string | null>,
	fn: TFn,
	input: QueryInput<TFn>,
	options?: TOptions
) {
	return queryOptions<QueryOutput<TFn>, DefaultError, TSelect, TypedQueryKey<TFn>>({
		queryKey: getArrayQueryKey(fn, input),
		queryFn: ({queryKey}) => qquery(init, queryKey[0][0], queryKey[1].input),
		...options
	});
}
