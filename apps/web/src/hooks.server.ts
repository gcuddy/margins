import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

import { createAuth } from '@margins/auth';
import { createDb } from '@margins/db';
import {
	DATABASE_HOST,
	DATABASE_PASSWORD,
	DATABASE_USERNAME,
} from '$env/static/private';

const setupDb = (async ({ event, resolve }) => {
	const config = {
		host: DATABASE_HOST,
		password: DATABASE_PASSWORD,
		username: DATABASE_USERNAME,
	};
	event.locals.db = createDb(config);
	event.locals.auth = createAuth(config);
	return resolve(event);
}) satisfies Handle;

const handleAuth = (async ({ event, resolve }) => {
	const auth = event.locals.auth;
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

export const handle: Handle = sequence(setupDb, handleAuth);
