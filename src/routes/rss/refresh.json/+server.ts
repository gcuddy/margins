import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { getRefreshedFeeds } from '../_rss-utils';

// can get pased in array of feed ids, or empty array for all
// should this be a post?
export const GET: RequestHandler = async ({ request }) => {
	console.log(`you hit the rss/refresh route`);
	const updatedItems = await getRefreshedFeeds();
	console.log({ updatedItems });
	return json({
		items: updatedItems
	});
};

const redirect = {
	status: 303,
	headers: {
		location: '/rss'
	}
};
