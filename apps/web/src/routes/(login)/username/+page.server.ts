import { type Actions, fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';

import type { PageServerLoad } from './$types';
import { usernameSchema } from './schema';
import { db } from '@margins/db';
import { zod } from 'sveltekit-superforms/adapters';

export const load: PageServerLoad = async (event) => {
	const { locals } = event;
	console.log('username load');
	if (!locals.user) {
		redirect(302, '/login');
	}
	if (locals.user.username) {
		// The user is already logged in and has a username
		redirect(302, `/u:${locals.user.username}`);
	}
	const form = await superValidate(event, zod(usernameSchema));

	return { form };
};

export const actions = {
	default: async (event) => {
		const user = event.locals.user;
		if (!user) {
			return fail(401);
		}
		const form = await superValidate(event, zod(usernameSchema));
		if (!form.valid) {
			return fail(400, { form });
		}
		const { username } = form.data;

		try {
			await db
				.updateTable('user')
				.set({ username })
				.where('id', '=', user.id)
				.execute();
		} catch (e) {
			console.error(e);
			return fail(400, { form, message: 'Username already taken' });
		}

		return redirect(302, `/u:${username}`);
	},
} satisfies Actions;
