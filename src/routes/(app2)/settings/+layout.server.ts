import { loginMessage } from '$lib/utils/redirects';
import { redirect } from 'sveltekit-flash-message/server';

export async function load(event) {
	const session = event.locals.session;
	// if (!session

	if (!session) {
		throw redirect('/login', loginMessage, event);
	}

	return {
		user: session.user,
	};

}
