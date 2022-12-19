import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// TODO: protect this - for internal caching
export const GET: RequestHandler = async ({ url, fetch }) => {
	const _url = url.searchParams.get('url') as string | undefined;
	if (!_url) {
		return new Response(undefined, {
			status: 400,
		});
		// return error(400, 'Must provide url.');
	}
	const urlToFetch = decodeURIComponent(_url);
	const res = await fetch(urlToFetch);
	console.log({ res });
	const text = await res.text();
	return new Response(text, {
		status: 200,
		headers: {
			'Cache-Control': 'private, max-age:60',
		},
	});
};
