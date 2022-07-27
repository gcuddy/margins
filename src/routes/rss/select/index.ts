import type { RequestHandler } from '@sveltejs/kit';
import { findRss } from './_rss-parser';
// import validUrl from 'valid-url';
import normalizeUrl from 'normalize-url';

// export const GET: RequestHandler = async ({ request, params }) => {
// 	// const form = await request.formData();
// 	// const url = form.get('url');
// 	console.log({ request, params });
// 	// console.log(url);
// 	// if (!url) {
// 	// 	return {
// 	// 		status: 400,
// 	// 		body: 'Missing url',
// 	// 		...redirect
// 	// 	};
// 	// } else if (typeof url === 'string') {
// 	// 	const parsed = await parseRss(url);
// 	// 	console.log({ parsed });
// 	// 	return {
// 	// 		status: 200,
// 	// 		body: JSON.stringify(parsed),
// 	// 		...redirect
// 	// 	};
// 	// } else {
// 	// 	return {
// 	// 		status: 400,
// 	// 		body: 'Invalid url',
// 	// 		...redirect
// 	// 	};
// 	// }
// };

// fix this
export const POST: RequestHandler = async ({ request, locals }) => {
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
			return {
				status: 404,
				...redirect
			};
		} else {
			console.log('Found feeds');
			console.log({ feeds });
			return {
				status: 200,
				body: {
					feeds
					// why does this give type error?
					// https://github.com/sveltejs/kit/issues/1997
				}
			};
		}
	} catch (e) {
		console.log(e);
		return {
			status: 404
		};
	}
};

const redirect = {
	headers: {
		location: '/rss/add?'
	}
};
