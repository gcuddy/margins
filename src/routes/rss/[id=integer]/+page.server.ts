import type { RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db';
export const GET: RequestHandler = async ({ params }) => {
	const id = params.id;
	try {
		const feed = await db.rssFeed.findFirst({
			where: {
				id: parseInt(id)
			},
			include: {
				items: {
					orderBy: {
						pubDate: 'desc'
					}
				},
				favorite: true
			}
		});
		console.log({ feed });
		// //todo: cache this
		// let items;
		// // if (feed?.feedUrl) {
		// // 	items = await getRawFeedItems(feed?.feedUrl);
		// // }
		// console.log({ items });
		return {
			body: {
				feed
			},
			status: 200
		};
	} catch (e) {
		console.error(e);
		return {
			status: 404
		};
	}
};
