import { auth } from '$lib/server/lucia';
import type { PageServerLoad } from './$types';
import { invalid, redirect, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const form = await request.formData();
		const email = form.get('email');
		const password = form.get('password');
		// check for empty
		if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
			return invalid(400, {
				message: 'Invalid input',
			});
		}
		try {
			const user = await auth.createUser('email', email, {
				password,
				attributes: {
					email,
				},
			});
			console.log({ user });
			const session = await auth.createSession(user.userId);
			locals.setSession(session);
		} catch (e) {
			return invalid(400, {
				message: 'Email already in use',
			});
		}
	},
};
