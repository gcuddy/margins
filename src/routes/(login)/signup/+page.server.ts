import { auth } from '$lib/server/lucia';
import type { PageServerLoad } from './$types';
import { invalid, redirect, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const form = await request.formData();
		const email = form.get('email');
		const password = form.get('password');
		const username = form.get('username');
		// check for empty
		if (
			!email ||
			!password ||
			!username ||
			typeof email !== 'string' ||
			typeof password !== 'string' ||
			typeof username !== 'string'
		) {
			return invalid(400, {
				message: 'Invalid input',
			});
		}
		try {
			// Create a new user by using email
			const user = await auth.createUser('email', email, {
				password,
				attributes: {
					email,
					username,
				},
			});
			const session = await auth.createSession(user.userId);
			locals.setSession(session);
		} catch (e) {
			console.log({ e });
			return invalid(400, {
				message: 'Email already in use',
			});
		}
	},
};
