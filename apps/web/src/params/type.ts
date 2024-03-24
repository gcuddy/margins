import { types } from '$lib/types';
import type { ParamMatcher } from '@sveltejs/kit';

export const match: ParamMatcher = (param) => {
    return param === "entry" || types.includes(param.toLowerCase());
};