import { auth } from '@margins/auth';
import { error, redirect } from '@sveltejs/kit';

export async function GET(event) {
	if (!event.locals.session) {
		return error(401, 'Unauthorized');
	}
	await auth.invalidateSession(event.locals.session.id);
	const sessionCookie = auth.createBlankSessionCookie();
	event.cookies.set(sessionCookie.name, sessionCookie.value, {
		path: '.',
		...sessionCookie.attributes,
	});
	redirect(302, '/login');
}
