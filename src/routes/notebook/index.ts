import { db } from '$lib/db';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {
	const { id } = params;
	console.log('getting /notebook');
	console.time('get notebook');
	const annotations = await db.annotation.findMany({
		include: {
			article: {
				select: {
					author: true,
					description: true,
					id: true,
					title: true,
					url: true
				}
			}
		},
		orderBy: {
			updatedAt: 'desc'
		}
	});
	// const articles = await db.article.findMany({
	// 	where: {
	// 		OR: [
	// 			{
	// 				annotations: {
	// 					some: {}
	// 				}
	// 			},
	// 			{
	// 				highlights: {
	// 					some: {}
	// 				}
	// 			}
	// 		]
	// 	},
	// 	include: {
	// 		annotations: true,
	// 		highlights: true,
	// 		tags: true
	// 	},
	// 	orderBy: {
	// 		createdAt: 'desc'
	// 	}
	// });
	console.timeEnd('get notebook');
	if (annotations) {
		return {
			body: {
				annotations
			}
		};
	} else {
		return {
			status: 404
		};
	}
};
