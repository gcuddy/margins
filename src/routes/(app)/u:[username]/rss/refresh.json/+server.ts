import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

import { getRefreshedItems } from '$lib/rss/parser.server';
// import { db } from '$lib/db';
// can get pased in array of feed ids, or empty array for all
// should this be a POST?
// it should return unread items, at least
export const GET: RequestHandler = async ({ request, locals }) => {
	console.log(`you hit the rss/refresh route`);
	console.time(`[rssRefresh]`);
	// const updatedItems = await getRefreshedFeeds();
	const { userId } = await locals.validate();
	const items = await getRefreshedItems(userId);

	console.log({ items });
	console.timeEnd(`[rssRefresh]`);
	// return response with prviate cache-control ehader for 60 seconds
	return json(items, {
		status: 200,
		headers: {
			'Cache-Control': 'private, max-age=900, stale-while-revalidate=300',
		},
	});
};

const redirect = {
	status: 303,
	headers: {
		location: '/rss',
	},
};
