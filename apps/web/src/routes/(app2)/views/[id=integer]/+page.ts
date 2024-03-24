import { queryFactory } from '$lib/queries/querykeys';
import type { PageLoad } from './$types';

export const load = (async (e) => {
	const { queryClient } = await e.parent();

	if (e.data.view.filterData) {
		await queryClient.prefetchInfiniteQuery(
			queryFactory.entries.list({
				dir: 'desc',
				filter: e.data.view.filterData,
				library: e.data.view.entryFilterType === 'Library',
				sort: 'published',
				status: null,
			}),
		);
	}

	return e.data;
}) satisfies PageLoad;
