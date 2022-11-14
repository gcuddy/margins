import { invalid, redirect, type Actions } from '@sveltejs/kit';
import { auth } from '$lib/server/lucia';
import type { PageServerLoad } from './$types';

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const form = await request.formData();
		const email = form.get('email');
		const password = form.get('password');
		// check for empty
		if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
			return invalid(400, {
				message: 'invalid input',
			});
		}
		try {
			const user = await auth.authenticateUser('email', email, password);
			const session = await auth.createSession(user.userId);
			locals.setSession(session);
		} catch (e) {
			return invalid(400, { message: 'Incorrect email or password' });
		}
	},
};

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.getSession();
	if (session) throw redirect(302, '/');
	return {};
};
