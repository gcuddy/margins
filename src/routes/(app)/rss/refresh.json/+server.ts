import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { getRefreshedFeeds } from '../_rss-utils';
import { db } from '$lib/db';
import { auth } from '$lib/lucia';
import { buildRssFeed } from '$lib/rss/parser';
// can get pased in array of feed ids, or empty array for all
// should this be a POST?
// it should return unread items, at least
export const GET: RequestHandler = async ({ request }) => {
	console.log(`you hit the rss/refresh route`);
	console.time(`[rssRefresh]`);
	// const updatedItems = await getRefreshedFeeds();
	const { user } = await auth.validateRequestByCookie(request);
	const feeds = await db.rssFeed.findMany({
		where: {
			users: {
				some: {
					id: user.user_id,
				},
			},
		},
	});
	const updatedFeeds = await Promise.all(feeds.map(async (f) => buildRssFeed({ url: f.feedUrl })));
	const transactions = feeds.map((feed, index) => {
		return db.rssFeed.update({
			where: {
				id: feed.id,
			},
			data: {
				items: {
					createMany: {
						skipDuplicates: true,
						data: updatedFeeds[index].items,
					},
				},
			},
		});
	});
	await db.$transaction(transactions);
	console.timeEnd(`[rssRefresh]`);
	// return response with prviate cache-control ehader for 60 seconds
	return new Response(undefined, {
		status: 200,
		headers: {
			'cache-control': 'private, max-age=300',
		},
	});
	return json({
		items: updatedItems,
	});
};

const redirect = {
	status: 303,
	headers: {
		location: '/rss',
	},
};
