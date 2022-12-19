import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, url, data, params, fetch }) => {
	console.log(`loading location ${params.location}`);
	const response = await fetch(`/api/bookmarks?location=${params.location.toLowerCase()}`);
	const annotations = await response.json();
	const parentData = await parent();
	return {
		...parentData,
		annotations,
		location: params.location.toLowerCase(),
	};
};
