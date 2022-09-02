import type { Location } from '$lib/types/schemas/Locations';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ params, parent }) => {
	// const data = await parent()
	const location = params.location.toUpperCase() as Location | 'ALL';
	// where: {
	//     location: location === 'ALL' ? undefined : location,
	// },
	return {
		location,
	};
};
