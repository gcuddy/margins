import { type Actions, fail, redirect } from '@sveltejs/kit';

import { auth } from '$lib/server/lucia';

import type { PageServerLoad } from './$types';

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const form = await request.formData();
		const email = form.get('email');
		const password = form.get('password');
		// check for empty
		if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
			return fail(400, {
				message: 'Invalid input',
			});
		}
		try {
			const key = await auth.useKey('email', email, password);
			const session = await auth.createSession(key.userId);
           console.log({session})
			locals.setSession(session);
		} catch (e) {
            console.error(e);
			return fail(400, { message: 'Incorrect email or password' });
		}
	},
};

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.validate();
	if (session) throw redirect(302, '/');
};
