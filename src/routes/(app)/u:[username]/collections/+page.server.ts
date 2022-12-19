import { error } from '@sveltejs/kit';
import { z } from 'zod';

import { db } from '$lib/db';
import { getJsonFromRequest } from '$lib/utils';

import type { Action, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, depends }) => {
	const session = await locals.validate();
	depends('app:collections');
	const lists = await db.collection.findMany({
		where: {
			userId: session.userId,
		},
	});
	return {
		lists,
	};
};

const listSchema = z.object({
	name: z.string(),
	description: z.string().optional(),
	articles: z.array(z.string()).optional(),
});

export const POST: Action = async ({ request }) => {
	try {
		const data = await getJsonFromRequest(request);
		const { name, description, articles } = listSchema.parse(data);
		const { id } = await db.collection.create({
			data: {
				name,
				description,
			},
		});
		if (articles) {
			await db.listItem.createMany({
				data: articles.map((article) => {
					return {
						articleId: parseInt(article),
						listId: id,
						type: 'ARTICLE',
					};
				}),
				skipDuplicates: true,
			});
		}
		return {
			location: `/lists/${id}`,
		};
	} catch (e) {
		console.error(e);
		throw error(400, 'error creating list');
	}
};
