import type { Location } from '$lib/types/schemas/Locations';
import { notEmpty } from '$lib/utils';
import type { Entry } from '@prisma/client';
import { error } from '@sveltejs/kit';

import type { PageLoad } from './$types';

export const load = (async ({ data, parent }) => {
    return {
        ...data,
        ...(await parent())
    }
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
