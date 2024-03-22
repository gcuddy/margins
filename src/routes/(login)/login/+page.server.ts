import { type Actions, fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';

// TODO: old passwords need to be updated to use new hashing

import { auth } from '$lib/server/lucia';

import type { PageServerLoad } from './$types';
import { loginUserSchema } from '../schema';
import type { Message } from '$lib/types';
import { Argon2id } from 'oslo/password';
import { db } from '$lib/db';

export const load: PageServerLoad = async (event) => {
	const { locals } = event;
	if (locals.user) {
		// The user is already logged in
		const redirectTo = event.url.searchParams.get('redirectTo');
		if (redirectTo) {
			// ensure that the redirect is not to the login page
			if (redirectTo !== '/login') {
				redirect(302, `/${redirectTo.slice(1)}`);
			}
		}
		// TODO: better redirect
		redirect(302, `/library/backlog`);
	}

	const form = await superValidate<typeof loginUserSchema, Message>(
		event,
		loginUserSchema,
	);

	return { form };
};

export const actions = {
	default: async (event) => {
		const form = await superValidate<typeof loginUserSchema, Message>(
			event,
			loginUserSchema,
		);
		if (!form.valid) {
			return fail(400, { form });
		}
		const { email, password } = form.data;
		try {
			const user = await db
				.selectFrom('user')
				.innerJoin('password', 'user.id', 'password.user_id')
				.selectAll()
				.where('email', '=', email.toLowerCase())
				.executeTakeFirst();

			if (!user) {
				return fail(400, { form, message: 'Incorrect email or password' });
			}

			const validPassword = await new Argon2id().verify(
				user.hashed_password,
				password,
			);

			if (!validPassword) {
				return fail(400, {
					form,
					message: 'Invalid password',
				});
			}

			const session = await auth.createSession(user.id, {});
			const sessionCookie = auth.createSessionCookie(session.id);

			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes,
			});

			const redirectTo = event.url.searchParams.get('redirectTo');
			if (redirectTo) {
				console.log({ redirectTo });
				redirect(302, `/${redirectTo.slice(1)}`);
			}

			return {
				form,
			};
		} catch (e) {
			console.error(e);
			return fail(500, { form });
		}
	},
} satisfies Actions;
