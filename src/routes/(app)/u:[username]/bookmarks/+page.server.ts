import { error } from '@sveltejs/kit';

import { db } from '$lib/db';
import parse from '$lib/parse';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	try {
		const bookmarks = await db.article.findMany({
			where: {
				bookmark: true,
			},
		});
		return {
			bookmarks,
		};
	} catch (e) {
		console.log(e);
		throw error(404);
	}
};

export const actions: Actions = {
	new: async ({ request, locals }) => {
		try {
			const session = await locals.validate();
			if (!session) {
				throw error(401);
			}
			const data = await request.formData();
			const url = data.get('url') as string;
			const content = await parse(url);
			const bookmark = await db.article.create({
				data: {
					...content,
					url,
					bookmark: true,
					user: {
						connect: {
							id: session.userId,
						},
					},
				},
			});
		} catch (e) {
			console.log(e);
			throw error(500);
		}
	},
};
