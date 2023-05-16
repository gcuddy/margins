import type { ParamMatcher } from '@sveltejs/kit';

const statuses = ["backlog", "now", "archive"] as const;

export const match: ParamMatcher = (param) => {
    // We Match "All" as well, even though it's not an "official" Location
    // if (param.toUpperCase() === 'all') {
    // 	return true;
    // }
    return statuses.includes(param.toLowerCase());
    // const location = LocationSchema.safeParse(param.toLowerCase());
    // if (location.success) {
    // 	return true;
    // } else {
    // 	return false;
    // }
};
