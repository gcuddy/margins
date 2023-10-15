import { type Actions, fail, redirect } from '@sveltejs/kit';
import { message, setError, superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';

import { auth } from '$lib/server/lucia';

import type { PageServerLoad } from './$types';
import { LuciaError } from 'lucia';
import { loginUserSchema } from '../schema';
import type { Message } from '$lib/types';

export const load: PageServerLoad = async (event) => {
	const { locals } = event;
	console.log(`login page load`);
	const session = await locals.auth.validate();
	if (session) {
		const redirectTo = event.url.searchParams.get('redirectTo');
		if (redirectTo) {
			console.log({ redirectTo });
			throw redirect(302, `/${redirectTo.slice(1)}`);
		} else {
			throw redirect(302, `/tests/library/backlog`);
		}
	}
	const form = await superValidate<typeof loginUserSchema, Message>(
		event,
		loginUserSchema,
	);
	return { form };
};

export const actions = {
	default: async (event) => {
		const { locals } = event;
		const form = await superValidate<typeof loginUserSchema, Message>(
			event,
			loginUserSchema,
		);
		if (!form.valid) {
			return fail(400, { form });
		}
		const { email, password } = form.data;
		try {
			const key = await auth.useKey('email', email, password);
			const session = await auth.createSession({
				userId: key.userId,
				attributes: {},
			});
			console.log({ session });
			locals.auth.setSession(session);
			const redirectTo = event.url.searchParams.get('redirectTo');
			if (redirectTo) {
				console.log({ redirectTo });
				throw redirect(302, `/${redirectTo.slice(1)}`);
			}
			return {
				form,
			};
		} catch (e) {
			console.error(e);
			if (
				e instanceof LuciaError &&
				(e.message === 'AUTH_INVALID_KEY_ID' ||
					e.message === 'AUTH_INVALID_PASSWORD')
			) {
				// const message = e.message;
				// form.message = 'Error authenticating';
				console.log({ e });

				return message(
					form,
					{
						status: 'error',
						text: 'Incorrect email or password',
					},
					{
						status: 400,
					},
				);
			}
			return fail(500, { form });
			// return fail(400, { message: 'Incorrect email or password' });
		}
	},
} satisfies Actions;
