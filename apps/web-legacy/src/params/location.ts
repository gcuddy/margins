import type { ParamMatcher } from '@sveltejs/kit';


export const match: ParamMatcher = (param) => {
	// We Match "All" as well, even though it's not an "official" Location
	return true;
	// if (param.toUpperCase() === 'ALL') {
	// 	return true;
	// }
	// const location = LocationSchema.safeParse(param.toLowerCase());
	// if (location.success) {
	// 	return true;
	// } else {
	// 	return false;
	// }
};
