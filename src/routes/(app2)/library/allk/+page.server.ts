import { get_library } from '$lib/server/queries';
import { redirect } from '@sveltejs/kit';

export async function load({ locals, params }) {
	const session = await locals.auth.validate();
	if (!session) {
		throw redirect(302, '/login');
	}

	// TODO: maybe fetch individually so that we can do infinite scroll for each column etc?
	const { entries, next } = await get_library(session.user.userId, null);

    return {
        entries,
        next
    }
}
