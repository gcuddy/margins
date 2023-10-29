import { loginRedirect } from '$lib/utils/redirects';

export async function load(e) {
	const session = await e.locals.auth.validate();
	if (!session) {
		throw loginRedirect(e);
	}
}
