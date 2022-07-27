import type { RequestHandler } from '@sveltejs/kit';

// can get pased in array of feed ids, or empty array for all
export const GET: RequestHandler = async ({ request }) => {
	// const feeds = await fetchFeeds();
	const data = await request.formData();
	console.table([...data.entries()]);

	return redirect;
};

const redirect = {
	status: 303,
	headers: {
		location: '/rss'
	}
};
