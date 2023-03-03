import { queryKeys } from "$lib/features/books/queries";
import type { RouterOutputs } from "$lib/trpc/router";

import type { PageLoad } from "./$types";

export const load = (async (evt) => {
	const { parent, params } = evt;
	const { id } = params;
	const { queryClient } = await parent();

	const searchQueries = queryClient.getQueriesData<RouterOutputs["books"]["public"]["search"]>(
		queryKeys.search()
	);
	const items = searchQueries.flatMap((s) => s[1]?.items).filter((s) => s);
	console.log({ searchQueries, items });
	const item = items.find((i) => i?.id === id);
	return {
		id,
		item,
	};
}) satisfies PageLoad;
