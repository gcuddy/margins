import { queryFactory } from '$lib/queries/querykeys';

import type { PageLoad } from './$types';

export const load = (async (event) => {
	const { queryClient } = await event.parent();

	await queryClient.prefetchQuery({
		...queryFactory.subscriptions.all(),
		meta: {
			init: event,
		},
	});
	return {
		// query: loadQuery(queryClient, queryKeys.subscriptions.list({ fetch, url })),
	};
}) satisfies PageLoad;
