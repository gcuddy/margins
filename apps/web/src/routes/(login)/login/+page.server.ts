import { type Actions, fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';

// TODO: old passwords need to be updated to use new hashing

import { auth } from '@margins/auth';

import type { PageServerLoad } from './$types';
import { loginUserSchema } from '../schema';
import { Argon2id } from 'oslo/password';
import { db } from '@margins/db';
import { zod } from 'sveltekit-superforms/adapters';

export const load: PageServerLoad = async (event) => {
	const { locals } = event;
	console.log('login load');
	if (locals.user) {
		redirect(302, '/library/backlog');
	}
	// if (locals.user) {
	// 	// The user is already logged in
	// 	const redirectTo = event.url.searchParams.get('redirectTo');
	// 	if (redirectTo) {
	// 		// ensure that the redirect is not to the login page
	// 		if (redirectTo !== '/login') {
	// 			redirect(302, `/${redirectTo.slice(1)}`);
	// 		}
	// 	}
	// 	// TODO: better redirect
	// 	redirect(302, `/library/backlog`);
	// }

	const form = await superValidate(event, zod(loginUserSchema));

	return { form };
};

export const actions = {
	default: async (event) => {
		console.log('login action');
		const form = await superValidate(event, zod(loginUserSchema));
		if (!form.valid) {
			return fail(400, { form });
		}
		const { email, password } = form.data;
		const user = await db
			.selectFrom('user')
			.innerJoin('password', 'user.id', 'password.user_id')
			.select(['user.id', 'user.email', 'password.hashed_password'])
			.where('email', '=', email.toLowerCase())
			.executeTakeFirst();

		if (!user) {
			return fail(400, { form, message: 'Incorrect email or password' });
		}

		console.log({ password, user });

		const validPassword = await new Argon2id().verify(
			user.hashed_password,
			password,
		);
		console.log({ validPassword });

		if (!validPassword) {
			// TODO: message
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

		console.log({
			session,
			sessionCookie,
		});
		return redirect(302, `/library/backlog`);
	},
} satisfies Actions;
