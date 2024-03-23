import { loginRedirect } from '$lib/utils/redirects';

export async function load(e) {
	const session = await e.locals.session;
	if (!session) {
		throw loginRedirect(e);
	}
}
