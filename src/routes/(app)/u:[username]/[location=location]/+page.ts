import { entriesByLocationQuery } from "$lib/features/entries/queries";

import type { PageLoad } from "./$types";

export const load = (async (event) => {
	const { data, parent } = event;
	const { queryClient } = await parent();

    console.time("entriesByLocationQuery")
	// const entries = await queryClient.ensureQueryData(entriesByLocationQuery({
	// 	location: data.location,
	// }, event));
	const entries = await queryClient.ensureQueryData(entriesByLocationQuery({
		location: data.location,
	}, event));

    // queryClient.prefetchQuery(entriesByLocationQuery({
    //     location: data.location
    // }, event));

	// console.log({entries})
    console.timeEnd("entriesByLocationQuery")

	return {
		...data,
		...(await parent()),
		entries
	};
}) satisfies PageLoad;

// export const load: PageLoad = async (event) => {
// 	const { parent, url, data, params, fetch } = event;
// 	console.log(`loading location ${params.location}`);
// 	// const response = await fetch(`/api/bookmarks?location=${params.location.toLowerCase()}`);
// 	// const bookmarks = (await response.json()) as ExtendedBookmark[];
// 	// console.log(`trpc`, { test });
// 	// const parentData = await parent();
// 	// console.log({ bookmarks, parentData });
// 	const parentData = await event.parent();
// 	if (!parentData.allEntries || !parentData.bookmarks || !parentData.states) {
// 		// do something here
// 		throw error(400);
// 		return
// 	}
// 	const location = params.location.toLowerCase() as Location | "all";
// 	let entriesForThisState: Entry[];
// 	if (location === "all") {
// 		entriesForThisState = parentData.allEntries;
// 	} else {
// 		const stateIds = parentData.states.filter(s => s.type === location).map(s => s.id);
// 		console.log({ location, stateIds })
// 		entriesForThisState = parentData.bookmarks.filter(b => stateIds.includes(b.stateId || 0) || location === "inbox" ? true : false).map(b => b.entry).filter(notEmpty)
// 	}
// 	return {
// 		...data,
// 		...parentData,
// 		// bookmarks,
// 		entries: entriesForThisState,
// 		location,
// 	};
// };
