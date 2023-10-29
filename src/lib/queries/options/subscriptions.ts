import { queryOptions } from '@tanstack/svelte-query';
import { qquery } from '../query';

export const subscriptionOptions = (feedId: number) =>
	queryOptions({
		queryKey: ['subscriptions', feedId] as const,
		queryFn: async ({ meta, queryKey }) =>
			qquery(meta?.init, 'subscription', {
				feedId: queryKey[1],
			}),
		// Todo: placeholder data
	});
