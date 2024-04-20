import { type Actions, fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';

// TODO: old passwords need to be updated to use new hashing

import type { PageServerLoad } from './$types';
import { loginUserSchema } from '../schema';
import { Argon2id } from 'oslo/password';
import { zod } from 'sveltekit-superforms/adapters';
import { redirectToUser } from '$lib/server/utils';

export const load: PageServerLoad = async (event) => {
	const { locals, url } = event;
	const isChromeExt = url.searchParams.get('chrome_ext');
	console.log('isChromeExt', isChromeExt);
	if (locals.user && locals.session) {
		if (isChromeExt) {
			return redirect(302, `/login-success?sessionToken=${locals.session.id}`);
		} else {
			redirect(302, redirectToUser(locals.user));
		}
	}

	const form = await superValidate(event, zod(loginUserSchema));

	return { form };
};

export const actions = {
	default: async (event) => {
		console.log('login action');
		const { auth, db } = event.locals;
		const form = await superValidate(event, zod(loginUserSchema));
		if (!form.valid) {
			return fail(400, { form });
		}
		const { email, password } = form.data;
		const user = await db
			.selectFrom('user')
			.innerJoin('password', 'user.id', 'password.user_id')
			.select([
				'user.id',
				'user.email',
				'user.username',
				'password.hashed_password',
			])
			.where('email', '=', email.toLowerCase())
			.executeTakeFirst();

		if (!user) {
			return fail(400, { form, message: 'Incorrect email or password' });
		}

		// console.log({ password, user });

		const validPassword = await new Argon2id().verify(
			user.hashed_password,
			password,
		);
		// console.log({ validPassword });

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

		const isChromeExt = event.url.searchParams.get('chrome_ext');
		if (isChromeExt) {
			return redirect(302, `/login-success?sessionToken=${session.id}`);
		}
		return redirect(302, redirectToUser(user));
	},
} satisfies Actions;
