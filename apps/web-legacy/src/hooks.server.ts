import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

import { darkThemes } from '$lib/features/settings/themes';
import { auth } from '$lib/server/lucia';

const handleTheme = (async ({ event, resolve }) => {
	let theme: string | null = null;

	const newTheme = event.url.searchParams.get('theme');
	const cookieTheme = event.cookies.get('theme');
	// TODO: when a theme is selected, add light/dark class depending on theme
	if (newTheme) {
		theme = newTheme;
	} else if (cookieTheme) {
		theme = cookieTheme;
	}
	return await resolve(event, {
		transformPageChunk: ({ html }) => {
			console.log({ theme });
			return html
				.replace(
					`data-theme=""`,
					theme && theme !== 'system' ? `data-theme="${theme}"` : '',
				)
				.replace(
					`class=""`,
					`class="${theme && darkThemes.includes(theme) ? 'dark' : ''}"`,
				);
		},
	});
}) satisfies Handle;

const handleAuth = (async ({ event, resolve }) => {
	const sessionId = event.cookies.get(auth.sessionCookieName);
	if (!sessionId) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const { session, user } = await auth.validateSession(sessionId);
	if (session && session.fresh) {
		const sessionCookie = auth.createSessionCookie(session.id);
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes,
		});
	}
	if (!session) {
		const sessionCookie = auth.createBlankSessionCookie();
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes,
		});
	}
	event.locals.user = user;
	event.locals.session = session;
	return resolve(event);
}) satisfies Handle;

export const handle: Handle = sequence(handleAuth, handleTheme);
