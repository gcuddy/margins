import { json } from '@sveltejs/kit';
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
					take: 10
				}
			}
		});
		console.timeEnd('rss-feeds');
		return json({
			feeds
		});
	} catch (e) {
		console.error(e);
		return new Response(undefined, { status: 404 });
	}
};
