import { keepPreviousData, queryOptions } from '@tanstack/svelte-query';
import { qquery } from './query';

export const pinsOptions = queryOptions({
	placeholderData: keepPreviousData,
	queryFn: ({ meta }) => qquery(meta?.init, 'pins', {}),
	queryKey: ['pins', 'list'] as const,
	staleTime: Number.POSITIVE_INFINITY,
});
