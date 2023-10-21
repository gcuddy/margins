import { error, json } from '@sveltejs/kit';

import { TMDB_API_KEY } from '$env/static/private';

export async function GET({ params, setHeaders, url }) {
	// TODO: rate limit

	// Endpoint that simply passes through to TMDB using our API key
	// This is to avoid exposing our API key to the client

	console.log({ params });
	const response = await fetch(
		`https://api.themoviedb.org/3/${
			params.tmdb
		}?api_key=${TMDB_API_KEY}&${url.searchParams.toString()}`,
	);

	if (!response.ok) {
		throw error(response.status);
	}

	setHeaders({
		'Cache-Control':
			response.headers.get('Cache-Control') || 'public, max-age=3600',
	});

	return json(await response.json());
}
