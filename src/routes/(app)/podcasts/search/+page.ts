import { browser } from "$app/environment";
import type { RouterOutputs } from "$lib/trpc/router";
import { podcastSearchQuery, queryKeys } from "$lib/features/podcasts/queries";
import type { PageLoad } from "./$types";

export const load = (async (evt) => {
	const q = evt.url.searchParams.get("q");

	if (!q) return {};
	if (browser) {
		const { queryClient } = await evt.parent();
		console.time("searchLoad");
		const query = podcastSearchQuery(evt, q);
		const results =
			queryClient.getQueryData<Awaited<ReturnType<(typeof query)["queryFn"]>>>(query.queryKey) ??
			(await queryClient.fetchQuery(query));
		console.timeEnd("searchLoad");
		console.log(`search`, { results });
		return {
			q,
			results,
		};
	}
	// createQuery({
	// 	queryKey: ["search", value],
	// 	// REVIEW: do i need to debounce this to avoid getting rate limtied?
	// 	queryFn: debouncedSearch,
	// 	// enabled: !!value,
	// 	onSuccess: (d) => {
	// 		console.log(d);
	// 	},
	// 	refetchOnWindowFocus: false,
	// 	keepPreviousData: true,
	// 	// initialData: form?.results ? form.results : undefined,
	// });
	return {
		q,
	};
}) satisfies PageLoad;
