import { loginRedirect } from '$lib/utils/redirects';

export async function load(event) {
	const session = await event.locals.auth.validate();
	if (!session) throw loginRedirect(event);

	return { session };
}
