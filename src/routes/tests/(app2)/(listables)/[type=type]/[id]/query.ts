import { page } from '$app/stores';
import { QueryInput, QueryOutput, createQueryOption, qquery } from '$lib/queries/query';
import { queryOptions } from '$lib/queries/utils';
import { CreateQueryOptions, DefaultError, createQuery } from '@tanstack/svelte-query';
import { derived } from 'svelte/store';

export const entryQuery = createQueryOption('entry_by_id');

const query = queryOptions({
	...createQueryOption('entry_by_id')
});

const entryOptions = (id: number) =>
	queryOptions({
		queryKey: ['entry', id] as const,
		queryFn: ({ queryKey }) => {
			const a = queryKey[1];
		}
	});

export function useEntry<TSelect = QueryOutput<'entry_by_id'>>(
	input: QueryInput<'entry_by_id'>,
	options?: CreateQueryOptions<QueryOutput<'entry_by_id'>, DefaultError, TSelect> & {
		initialData?: undefined;
	}
) {
	return createQuery(
		derived(page, ($page) => ({
			queryKey: ['entry', input] as const,
			queryFn: () => qquery($page, 'entry_by_id', input),
			// initialData: undefined,
			...options
		}))
	);
}
