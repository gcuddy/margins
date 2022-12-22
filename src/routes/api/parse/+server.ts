import { error, json } from '@sveltejs/kit';

import { normalizeUrl } from '$lib/feeds/utils';
import parse from '$lib/parse';

import type { RequestHandler } from './$types';
export const GET: RequestHandler = async ({ request, url }) => {
	try {
		const _url = url.searchParams.get('url');
		console.log(`api/parse`, { _url });
		if (!_url) {
			throw error(400, 'url required');
		}
		console.log({ _url });
		const normalizedUrl = normalizeUrl(_url);
		// todo: url params for title, description, html
		const parsed = await parse(normalizedUrl);
		return json(parsed, {
			headers: {
				'Cache-Control': 'max-age=60',
			},
		});
	} catch (e) {
		console.error(e);
		throw error(500);
	}
};
