import type { Location } from '$lib/types/schemas/Locations';

import type { PageLoad } from './$types';

export const load: PageLoad = async (event) => {
	const { parent, url, data, params, fetch } = event;
	console.log(`loading location ${params.location}`);
	// const response = await fetch(`/api/bookmarks?location=${params.location.toLowerCase()}`);
	// const bookmarks = (await response.json()) as ExtendedBookmark[];
	// console.log(`trpc`, { test });
	// const parentData = await parent();
	// console.log({ bookmarks, parentData });
	return {
		...data,
		// bookmarks,
		location: params.location.toLowerCase() as Location | 'ALL',
	};
};
