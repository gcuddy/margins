import type { RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db';
export const GET: RequestHandler = async ({ params }) => {
	const uuid = params.feed;
	try {
		// const items = await db.rssFeedItem.findMany({
		// 	where: {
		// 		rssFeedId: parseInt(id)
		// 	},
		// 	orderBy: [
		// 		{
		// 			createdAt: 'desc'
		// 		}
		// 	],
		// 	include: {
		// 		RssFeed: true
		// 	}
		// });
		const feed = await db.rssFeed.findFirst({
			where: {
				uuid
			},
			include: {
				items: true
			}
		});
		//todo: cache this
		let items;
		// if (feed?.feedUrl) {
		// 	items = await getRawFeedItems(feed?.feedUrl);
		// }
		console.log({ items });
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
