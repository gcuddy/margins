import { error, json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db';
import { auth } from '$lib/server/lucia';
export const GET: RequestHandler = async ({ url, locals, request }) => {
	const cursor = url.searchParams.get('cursor');
	const unread = url.searchParams.get('unread');
	const have = url.searchParams.get('have')?.split(',') || [];
	try {
		const session = await auth.validateRequest(request);
		if (cursor) {
			const items = await db.rssFeedItem.findMany({
				where: {
					uuid: {
						notIn: have,
					},
					feed: {
						users: {
							some: {
								id: session['userId'],
							},
						},
					},
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
							userId: session['userId'],
						},
					},
					feed: {
						select: {
							title: true,
							id: true,
							link: true,
							feedUrl: true,
						},
					},
				},
				// TODO select
			});
			console.log({ items });
			return json({
				items,
				cursor: items[items.length - 1]?.id,
			});
		} else {
			console.log({ user: session });
			const items = await db.rssFeedItem.findMany({
				where: {
					feed: {
						users: {
							some: {
								id: session['userId'],
							},
						},
					},
				},
				take: 50,
				orderBy: {
					pubDate: 'desc',
				},
				include: {
					feed: {
						select: {
							title: true,
							id: true,
							link: true,
						},
					},
				},
			});
			// const items = await db.rssFeedItem.findMany({
			// 	where: {
			// 		feed: {
			// 			users: {
			// 				some: {
			// 					id: user['userId'],
			// 				},
			// 			},
			// 		},
			// 		interactions:
			// 			unread === 'true'
			// 				? {
			// 						some: {
			// 							user: {
			// 								id: user['userId'],
			// 							},
			// 							is_read: false,
			// 						},
			// 				  }
			// 				: undefined,
			// 	},
			// 	take: 50,
			// 	include: {
			// 		interactions: {
			// 			where: {
			// 				userId: user['userId'],
			// 			},
			// 		},
			// 		feed: {
			// 			select: {
			// 				title: true,
			// 				id: true,
			// 			},
			// 		},
			// 	},
			// 	orderBy: {
			// 		pubDate: 'desc',
			// 	},
			// 	// TODO select
			// });
			console.log({ items });
			return json(
				{
					items,
					cursor: items[items.length - 1]?.id,
				},
				{
					headers: {
						'Cache-Control': 'private, max-age=900, stale-while-revalidate=300',
					},
				}
			);
		}
	} catch (e) {
		console.error(e);
		throw error(500, 'error');
	}
};
