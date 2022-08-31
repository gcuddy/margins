import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { getRefreshedFeeds } from '../_rss-utils';

// can get pased in array of feed ids, or empty array for all
// should this be a POST?
export const GET: RequestHandler = async ({ request }) => {
	console.log(`you hit the rss/refresh route`);
	const updatedItems = await getRefreshedFeeds();
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
