import type { RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db';
import { getJsonFromRequest } from '$lib/utils';
import { z } from 'zod';

export const GET: RequestHandler = async ({ request }) => {
	const lists = await db.list.findMany();
	return {
		status: 200,
		body: {
			lists
		}
	};
};

const listSchema = z.object({
	name: z.string(),
	description: z.string().optional(),
	articles: z.array(z.string()).optional()
});

export const POST: RequestHandler = async ({ request, locals }) => {
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
			const listItems = await db.listItem.createMany({
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
			status: 200,
			body: {
				id
			},
			headers: {
				Location: '/lists'
			}
		};
	} catch (e) {
		console.error(e);
		return {
			status: 400
		};
	}
	// right now we just support article ids
};
