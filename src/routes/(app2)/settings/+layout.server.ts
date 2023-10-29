import { loginMessage } from '$lib/utils/redirects';
import { redirect } from 'sveltekit-flash-message/server';

export async function load(event) {
	const session = await event.locals.auth.validate();
	// if (!session

	if (!session) {
		throw redirect('/login', loginMessage, event);
	}

	return {
		user: session.user,
	};

}
