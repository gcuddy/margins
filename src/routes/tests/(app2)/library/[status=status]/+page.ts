import { queryFactory } from '$lib/queries/querykeys';

export async function load(event) {
	const { parent, data, url } = event;

	const query = queryFactory.entries.list({
		status: data.Status,
		type: data.type,
		search: url.searchParams.get('search') ?? undefined
	});

	const { queryClient } = await parent();
	await queryClient.prefetchInfiniteQuery({
		// ...,
		...query,
		meta: {
			init: event
		}
		// meta:
	});

	return data;
}
