import type { ParamMatcher } from '@sveltejs/kit';

const statuses = ['backlog', 'now', 'done'];

export const match: ParamMatcher = (param) => {
	return statuses.includes(param);
};
