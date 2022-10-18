import { invalid, redirect, type Actions } from '@sveltejs/kit';
import { auth } from '$lib/server/lucia';

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const form = await request.formData();
		const email = form.get('email');
		const password = form.get('password');
		if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
			return invalid(400, {
				message: 'invalid input',
			});
		}
		try {
			const user = await auth.authenticateUser('email', email, password);
			const { setSessionCookie } = await auth.createSession(user.userId);
			setSessionCookie(cookies);
		} catch (e) {
			const error = e as Error;
			if (
				error.message === 'AUTH_INVALID_IDENTIFIER_TOKEN' ||
				error.message === 'AUTH_INVALID_PASSWORD'
			) {
				return invalid(400, { message: 'Incorrect email or password.' });
			}
			console.error(error);
			return invalid(500, {
				message: 'Unknown error.',
			});
		}
		throw redirect(302, '/login');
	},
};
