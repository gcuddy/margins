import { Actions, fail, redirect } from '@sveltejs/kit';
import { auth } from '$lib/server/lucia';

// handle all random form actions

export const actions: Actions = {
	logout: async (event) => {
		const session = await event.locals.auth.validate();
		if (!session) return fail(401);
		await auth.invalidateSession(session.sessionId); // invalidate session
		event.locals.auth.setSession(null); // remove cookie
		throw redirect(302, '/login'); // redirect to login page
	},
};
