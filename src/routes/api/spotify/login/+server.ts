import { redirect } from '@sveltejs/kit';

import {
	PUBLIC_SPOTIFY_CLIENT_ID,
	PUBLIC_SPOTIFY_REDIRECT_URI,
} from '$env/static/public';

import type { RequestHandler } from './$types';

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
const generateRandomString = (length: number) => {
	let text = '';
	const possible =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < length; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
};

const stateKey = 'spotify_auth_state';

export const GET: RequestHandler = async ({ cookies }) => {
	const state = generateRandomString(16);
	cookies.set(stateKey, state, {
		path: '/',
	});
	const scope = 'user-read-private user-read-email user-library-read';

	const url = new URL('https://accounts.spotify.com/authorize');
	url.searchParams.set('client_id', PUBLIC_SPOTIFY_CLIENT_ID);
	url.searchParams.set('response_type', 'code');
	url.searchParams.set('redirect_uri', PUBLIC_SPOTIFY_REDIRECT_URI);
	url.searchParams.set('scope', scope);
	throw redirect(307, url.toString());
};
