import { getEntriesForAuthor } from '$lib/author.server';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	return {
		entries: await getEntriesForAuthor({ name: params.name }),
	};
};
