import { error } from '@sveltejs/kit';

import { db } from '$lib/db';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (!session) {
		throw error(401, 'not authorized');
	}
	const stylesheets = await db.stylesheet.findMany({
		where: {
			userId: session?.userId,
		},
	});
	return {
		stylesheets,
	};
};
