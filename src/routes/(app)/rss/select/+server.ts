import { error, type Action } from '@sveltejs/kit';
import { findRss } from './_rss-parser';
import normalizeUrl from 'normalize-url';

// fix this
export const POST: Action = async ({ request }) => {
	const form = await request.formData();
	let url = <string>form.get('url');
	console.log(url);
	url = normalizeUrl(url, {
		stripWWW: false,
		removeTrailingSlash: false
	});
	try {
		const feeds = await findRss(url);
		// return either feedurls and site meta or, if direct xml/json feed, just the feed itself
		if (!feeds) {
			console.log('Nothing found');
			throw error(400);
		}
	} catch (e) {
		console.log(e);
	}
};
