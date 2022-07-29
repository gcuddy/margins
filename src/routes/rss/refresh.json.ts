import type { RequestHandler } from '@sveltejs/kit';
import { getRefreshedFeeds } from './_rss-utils';

// can get pased in array of feed ids, or empty array for all
// should this be a post?
export const GET: RequestHandler = async ({ request }) => {
	console.log(`you hit the rss/refresh route`);
	const updatedFeeds = await getRefreshedFeeds();
	return {
		status: 200,
		body: {
			feeds: updatedFeeds
		}
		// cache response for 1 minute
		// headers: {
		// 	'Cache-Control': 'max-age=60',
		// 	location: '/rss'
		// }
	};
};

const redirect = {
	status: 303,
	headers: {
		location: '/rss'
	}
};
