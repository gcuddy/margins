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

	const viewPreferences = await queryClient.ensureQueryData({
		...queryFactory.viewPreferences.getOrCreate({
			viewType: data.Status ?? 'All',
		}),
		meta: {
			init: event,
		},
	});
	// await queryClient.prefetchInfiniteQuery({
	// 	// ...,
	// 	...query,
	// 	meta: {
	// 		init: event
	// 	}
	// 	// meta:
	// });

	return {
		...data,
		viewPreferences,
	};
}) satisfies PageLoad;
