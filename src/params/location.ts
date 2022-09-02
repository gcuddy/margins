import { LocationSchema } from '$lib/types/schemas/Locations';
import type { ParamMatcher } from '@sveltejs/kit';

export const match: ParamMatcher = (param) => {
	// We Match "All" as well, even though it's not an "official" Location
	if (param.toUpperCase() === 'ALL') {
		return true;
	}
	const location = LocationSchema.safeParse(param.toUpperCase());
	if (location.success) {
		return true;
	} else {
		return false;
	}
};
