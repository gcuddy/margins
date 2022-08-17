import type { RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db';
export const GET: RequestHandler = async () => {
	try {
		console.time('rss-feeds');
		const feeds = await db.rssFeed.findMany({
			orderBy: [
				{
					title: 'asc'
				}
			],
			include: {
				items: {
					include: {
						RssFeed: true
					},
					take: 10
				}
			}
		});
		console.log(`feeds.json`, { feeds });
		console.timeEnd('rss-feeds');
		return {
			body: {
				feeds
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
