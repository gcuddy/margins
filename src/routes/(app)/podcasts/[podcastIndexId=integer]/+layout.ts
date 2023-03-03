import type { ApiResponse } from "podcastdx-client/dist/src/types";

import { browser } from "$app/environment";
import { podcastDetailsQuery, podcastEpisodesQuery, queryKeys } from "$lib/features/podcasts/queries";

import type { LayoutLoad } from "./$types";

export const load = (async (e) => {
	const { podcastIndexId } = e.params;
	const id = +podcastIndexId;
	const { queryClient } = await e.parent();

	// REVIEW: do i need to await this?
	// check for data from search cache... ?
	console.time("getSearchQueryData");
	// const searchData = queryClient.getQueryData(["search"]);
	console.log(`search`, queryClient.getQueriesData(["podcasts"]));
	const searchQueries = queryClient.getQueriesData(queryKeys.searchHolder());
	const searchResults = searchQueries.flatMap((q) => q[1]).flatMap((r) => (r as any)?.feeds);
	const searchResult = searchResults.find((r) => (r as any)?.id === id);
	console.log({ searchQueries, searchResults, searchResult });
	console.timeEnd("getSearchQueryData");
	// if (!browser && searchResult) {
	// }
	if (searchResult) {
		console.log({ searchResult });
		return {
			id,
			searchResult: {
				feed: searchResult as ApiResponse.Search["feeds"][number],
			},
		};
	}
	if (!browser) {
		await queryClient.prefetchQuery({
			...podcastDetailsQuery(e, id),
			initialData: searchResult,
		});
		// see https://dev.to/tkdodo/react-query-meets-react-router-38f3 for more — but I think this pattern should work fine
		// const podcastQuery = podcastDetailsQuery(e, +podcastIndexId)
		// queryClient.getQueryData(podcastQuery.queryKey)
		await queryClient.prefetchQuery(podcastEpisodesQuery(e, id));
	}
	return {
		id,
	};
}) satisfies LayoutLoad;
