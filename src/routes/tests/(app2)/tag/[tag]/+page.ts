import { query } from '$lib/queries/query';
import { queryFactory } from '$lib/queries/querykeys';
const entriesQueryOpts = (id: number) =>
	queryFactory.entries.list({
		filter: {
			tags: {
				ids: [id],
			},
		},
		status: null,
	});

export const load = async (e) => {
	const { data, fetch, params, parent, url } = e;
	const { queryClient } = await parent();
	const { tag: name } = params;

	const { tagDetails } = data;

	await Promise.all([
		url.searchParams.get('tab') === 'notes'
			? queryClient.prefetchQuery({
					queryFn: async () => query(e, 'get_notes_for_tag', { name }),
					queryKey: ['tag', name, 'notes'],
			  })
			: queryClient.prefetchInfiniteQuery(entriesQueryOpts(tagDetails.id)),
	]);
	return {
		...data,
		entriesQueryOpts,
		tag: name,
	};
};
