import type { PageLoad } from './$types';

export const load = (async (e) => {
	const { queryClient } = await e.parent();
	const { id } = e.params;
	// const opts = queryKeys.entries.feedId(e, Number(id));
	return {
		// query: loadQuery(queryClient, opts),
		...e.data,
		id,
	};
}) satisfies PageLoad;
