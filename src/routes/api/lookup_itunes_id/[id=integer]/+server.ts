import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ request, params }) => {
	const { id } = params;
	const { results } = JSON.parse(
		await fetch(`https://itunes.apple.com/lookup?id=${id}`).then((res) => res.text())
	);
	const data = results[0];
	if (data.kind !== 'podcast') {
		return new Response('not a podcast', { status: 400 });
	}
	const { feedUrl, artworkUrl100, artistName, collectionName, releaseDate } = data;
	return json(data, {
		headers: {
			// cache for one day (that's what itunes does)
			'cache-control': 'public, max-age=86380',
		},
	});
};
