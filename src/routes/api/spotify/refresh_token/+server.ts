import { error, json } from '@sveltejs/kit';

import { SPOTIFY_CLIENT_SECRET } from '$env/static/private';
import { PUBLIC_SPOTIFY_CLIENT_ID } from '$env/static/public';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (e) => {
	console.log(
		'RECEIVED REFRESH TOKEN REQUEST',
		e.url.searchParams.get('refresh_token'),
	);
	const refresh_token = e.url.searchParams.get('refresh_token');
	if (!refresh_token) {
		throw error(400, 'No refresh token provided');
	}
	const api = new URL('https://accounts.spotify.com/api/token');
	// api.searchParams.set("grant_type", "refresh_token");
	// api.searchParams.set("refresh_token", refresh_token);
	const form = new FormData();
	form.set('grant_type', 'refresh_token');
	form.set('refresh_token', refresh_token);

	const res = await e.fetch(api, {
		body: new URLSearchParams({
			grant_type: 'refresh_token',
			refresh_token,
		}),
		headers: {
			Authorization: `Basic ${Buffer.from(
				`${PUBLIC_SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`,
			).toString('base64')}`,
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		method: 'POST',
	});
	console.log({ res });
	if (res.status === 200) {
		return json(await res.json());
	}
	console.log(res.body);
	throw error(res.status, res.statusText);
};
