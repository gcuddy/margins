import { invalid, redirect, type Actions } from '@sveltejs/kit';
import { auth } from '$lib/server/lucia';
import { setCookie } from 'lucia-sveltekit';

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const form = await request.formData();
		const username = form.get('username');
		const password = form.get('password');
		if (!username || !password || typeof username !== 'string' || typeof password !== 'string') {
			return invalid(400, {
				message: 'invalid input',
			});
		}
		try {
			const userSession = await auth.authenticateUser('username', username, password);
			setCookie(cookies, ...userSession.cookies);
		} catch (e) {
			const error = e as Error;
			if (
				error.message === 'AUTH_INVALID_IDENTIFIER_TOKEN' ||
				error.message === 'AUTH_INVALID_PASSWORD'
			) {
				return invalid(400, { message: 'Incorrect username or password.' });
			}
			console.error(error);
			return invalid(500, {
				message: 'Unknown error.',
			});
		}
		throw redirect(302, '/login');
	},
};
