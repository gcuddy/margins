import { locations } from '@margins/features/entries';
import type { ParamMatcher } from '@sveltejs/kit';

export const statuses = locations.map((l) => l.toLowerCase());

export const match: ParamMatcher = (param) => {
	return statuses.includes(param.toLowerCase());
};
