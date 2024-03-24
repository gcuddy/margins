import { objectKeys } from '$lib/helpers';
import { EntryFilterType } from '$lib/prisma/kysely/enums';
import type { ParamMatcher } from '@sveltejs/kit';

const scopes = objectKeys(EntryFilterType).map(
	(key) => key.toLowerCase() as Lowercase<typeof key>,
);

export const match: ParamMatcher = (param) => {
	return ['library', 'all'].includes(param);
};
