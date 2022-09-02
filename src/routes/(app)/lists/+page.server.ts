import type { PageServerLoad, Action } from './$types';
import { db } from '$lib/db';
import { getJsonFromRequest } from '$lib/utils';
import { z } from 'zod';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	const lists = await db.list.findMany();
	return {
		lists
	};
};

const listSchema = z.object({
	name: z.string(),
	description: z.string().optional(),
	articles: z.array(z.string()).optional()
});

export const POST: Action = async ({ request }) => {
	try {
		const data = await getJsonFromRequest(request);
		const { name, description, articles } = listSchema.parse(data);
		const { id } = await db.list.create({
			data: {
				name,
				description
			}
		});
		if (articles) {
			await db.listItem.createMany({
				data: articles.map((article) => {
					return {
						articleId: parseInt(article),
						listId: id,
						type: 'ARTICLE'
					};
				}),
				skipDuplicates: true
			});
		}
		return {
			location: `/lists/${id}`
		};
	} catch (e) {
		console.error(e);
		throw error(400, 'error creating list');
	}
};
