import { loginRedirect } from '$lib/utils/redirects';

export async function load(event) {
	const session = event.locals.session;
	if (!session) throw loginRedirect(event);
}
