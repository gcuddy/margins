import { db } from '$lib/db';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {
	const { id } = params;
	console.log('getting /notebook');
	const articles = await db.article.findMany({
		where: {
			OR: [
				{
					annotations: {
						some: {}
					}
				},
				{
					highlights: {
						some: {}
					}
				}
			]
		},
		include: {
			annotations: true,
			highlights: true,
			tags: true
		},
		orderBy: {
			createdAt: 'desc'
		}
	});
	if (articles) {
		return {
			body: {
				articles
			}
		};
	} else {
		return {
			status: 404
		};
	}
};
