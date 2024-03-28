import { generateCodeVerifier, generateState } from 'arctic';
import { google } from '@margins/auth/oauth';
import { dev } from '$app/environment';
import { redirect } from '@sveltejs/kit';

export async function GET(event) {
	const state = generateState();
	const codeVerifier = generateCodeVerifier();

	const url = await google.createAuthorizationURL(state, codeVerifier, {
		scopes: ['profile', 'email'],
	});

	event.cookies.set('google_oauth_state', state, {
		httpOnly: true,
		maxAge: 60 * 10, // 10 minutes
		path: '/',
		secure: dev ? false : true,
	});

	event.cookies.set('google_oauth_code_verifier', codeVerifier, {
		httpOnly: true,
		maxAge: 60 * 10, // 10 minutes
		path: '/',
		secure: dev ? false : true,
	});

	return redirect(302, url);
}
