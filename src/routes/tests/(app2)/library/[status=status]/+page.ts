import { queryFactory } from '$lib/queries/querykeys';

import type { PageLoad } from './$types';

export const load = (async (event) => {
	const { data, parent, url } = event;

	const query = queryFactory.entries.list({
		search: url.searchParams.get('search') ?? undefined,
		status: data.Status,
		type: data.type,
	});

	const { queryClient } = await parent();
	// await queryClient.prefetchInfiniteQuery({
	// 	// ...,
	// 	...query,
	// 	meta: {
	// 		init: event
	// 	}
	// 	// meta:
	// });

	return data;
}) satisfies PageLoad;
