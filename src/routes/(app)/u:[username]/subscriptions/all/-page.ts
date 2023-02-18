import { trpc } from "$lib/trpc/client";
import type { PageLoad } from "./$types";

export const load: PageLoad = async (event) => {
	const { queryClient } = await event.parent();

	// REVIEW: cursor here?
	await queryClient.prefetchInfiniteQuery({
		queryKey: ["susbcriptions", "all"],
		queryFn: () =>
			trpc(event).entries.listForUserSubscriptions.query({
				cursor: 0,
			}),
	});
	// const { entries, nextCursor } = await caller.entries.listForUserSubscriptions();
	return {
		// entries,
		// nextCursor,
		title: "All items",
	};
};
