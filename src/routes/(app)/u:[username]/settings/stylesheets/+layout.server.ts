import { error } from '@sveltejs/kit';

import { db } from '$lib/db';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.validate();
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

export const actions: Actions = {
	create: async ({ request, locals }) => {
		const session = await locals.validate();
		if (!session) {
			throw error(401, 'not authorized');
		}
		const data = await request.formData();
		const css = (data.get('css') as string) || '';
		const domain = data.get('domain') as string;
		const stylesheet = await db.stylesheet.create({
			data: {
				css,
				domain,
				userId: session.userId,
			},
		});
		return {
			stylesheet,
		};
	},
};
