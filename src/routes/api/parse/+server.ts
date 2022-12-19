import parse from '$lib/parse';
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
export const GET: RequestHandler = async ({ request, url }) => {
	try {
		const _url = url.searchParams.get('url');
		// todo: url params for title, description, html
		const parsed = await parse(_url);
		return json(parsed, {
			headers: {
				'Cache-Control': 'max-age=300',
			},
		});
	} catch (e) {
		console.error(e);
	}
};
