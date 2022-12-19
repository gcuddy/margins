import { json, type RequestHandler } from '@sveltejs/kit';
import { buildPodcast } from '$lib/rss/parser.server';

// this currently just handles xml
export const GET: RequestHandler = async ({ request, url: Url }) => {
	// provide either url or feedUrl
	let url = Url.searchParams.get('url');
	if (!url) {
		const json = await request.json();
		url = json.feedUrl || json.url;
	}
	console.log({ url });
	const podcast = await buildPodcast(url);
	console.log({ podcast });
	return json(podcast, {
		headers: {
			'cache-control': 'public, max-age=300',
		},
	});
};
