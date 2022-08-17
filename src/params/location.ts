import { LocationSchema } from '$lib/types/schemas/Locations';
import type { ParamMatcher } from '@sveltejs/kit';

export const match: ParamMatcher = (param) => {
	const location = LocationSchema.safeParse(param.toUpperCase());
	if (location.success) {
		return true;
	} else {
		return false;
	}
};
