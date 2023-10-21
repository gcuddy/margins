import type { ParamMatcher } from '@sveltejs/kit';

const types = [
    "author",
    "director"
]

export const match: ParamMatcher = (param) => {
    return types.includes(param);
};