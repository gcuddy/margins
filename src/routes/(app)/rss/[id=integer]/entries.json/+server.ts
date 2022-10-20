import { error, json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db';
import { auth } from '$lib/server/lucia';
import { request } from '@playwright/test';
export const GET: RequestHandler = async ({ url, locals, params, request }) => {
	const cursor = url.searchParams.get('cursor');
	const unread = url.searchParams.get('unread');
	const have =
		url.searchParams
			.get('have')
			?.split(',')
			.map((h) => Number(h)) || [];
	const id = Number(params.id);
	try {
		const user = await auth.validateRequest(request);
		if (cursor) {
			const items = await db.rssFeedItem.findMany({
				where: {
					feed: {
						id,
					},
					// NOT: {
					// 	id: {
					// 		in: have,
					// 	},
					// },
					// interactions:
					// 	unread === 'true'
					// 		? {
					// 				some: {
					// 					user: {
					// 						id: user['userId'],
					// 					},
					// 					is_read: false,
					// 				},
					// 		  }
					// 		: undefined,
				},
				take: 50,
				orderBy: {
					pubDate: 'desc',
				},
				cursor: {
					id: Number(cursor),
				},
				skip: 1,
				include: {
					interactions: {
						where: {
							userId: user['userId'],
						},
					},
					feed: {
						select: {
							title: true,
							id: true,
						},
					},
				},
				// TODO select
			});
			return json({
				items,
				cursor: items[items.length - 1]?.id,
			});
		} else {
			const items = await db.rssFeedItem.findMany({
				where: {
					feed: {
						id,
					},
					// NOT: {
					// 	id: {
					// 		in: have,
					// 	},
					// },
					// interactions:
					// 	unread === 'true'
					// 		? {
					// 				some: {
					// 					user: {
					// 						id: user['userId'],
					// 					},
					// 					is_read: false,
					// 				},
					// 		  }
					// 		: undefined,
				},
				take: 50,
				orderBy: {
					pubDate: 'desc',
				},
				include: {
					interactions: {
						where: {
							userId: user['userId'],
						},
					},
					feed: {
						select: {
							title: true,
							id: true,
						},
					},
				},
				// TODO select
			});
			// console.log({ items });
			return json({
				items,
				cursor: items[items.length - 1]?.id,
			});
		}
	} catch (e) {
		console.error(e);
		throw error(500, 'error');
	}
};
