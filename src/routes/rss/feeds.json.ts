import type { RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db';
export const GET: RequestHandler = async () => {
	try {
		const feeds = await db.rssFeed.findMany({
			orderBy: [
				{
					title: 'asc'
				}
			],
			include: {
				items: false
			}
		});
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
