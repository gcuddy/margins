import { type Actions, fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';

import { auth } from '$lib/server/lucia';
import { createDefaultStates } from '$lib/user';
import { message, setError, superValidate } from 'sveltekit-superforms/server';
import { createUserSchema, loginUserSchema } from '../schema';
import { db } from '$lib/db';
import { generateLuciaPasswordHash, generateRandomString } from 'lucia/utils';
import { trytm } from '$lib/utils';
import { createKeyId } from 'lucia';
import type { Message } from '$lib/types/forms';

export async function load() {
	const form = await superValidate<typeof createUserSchema, Message>(
		createUserSchema,
	);

	return {
		form,
	};
}

export const actions: Actions = {
	default: async (event) => {
		const { request, locals } = event;
		const form = await superValidate<typeof createUserSchema, Message>(
			event,
			createUserSchema,
		);
		if (!form.valid) {
			return fail(400, { form });
		}
		try {
			// Create a new user by using email

			const { email, password, username, inviteCode } = form.data;
			// TODO: Oauth

			// validate invite code
			const code = await db
				.selectFrom('InvitationCode')
				.where('used', '=', 0)
				.where('code', '=', inviteCode)
				.select(['code'])
				.executeTakeFirst();

			if (!code) {
				return setError(form, 'inviteCode', 'Invalid invite code');
			}

			// TODO: oauth

			const userId = generateRandomString(15);
			// we know if this transaction fails, it's an error with username/email duplicate... right?
			await db.transaction().execute(async (trx) => {
				// we handle creation ourselves instead of with lucia provided auth...
				const user = await trx
					.insertInto('auth_user')
					.values({
						email,
						id: userId,
						updatedAt: new Date(),
						username,
					})
					.execute();

				console.log({ user });

				const key = await trx
					.insertInto('auth_key')
					.values({
						id: createKeyId('email', email),
						user_id: userId,
						hashed_password: await generateLuciaPasswordHash(password),
					})
					.execute();

				console.log({ key });

				return await trx
					.updateTable('InvitationCode')
					.set({
						used: 1,
						usedById: userId,
					})
					.where('code', '=', inviteCode)
					.execute();
			});

			const session = await auth.createSession({
				userId,
				attributes: {},
			});
			locals.auth.setSession(session);

			// we got here! let's redirect now
		} catch (e) {
			console.log({ e });
			// There was an error creating the user — almost definitely a duplicate email/username
			// TODO: we should check to make sure it was actually duplicate
			return message(
				form,
				{
					status: 'error',
					text: 'Email or username is already in use.',
				},
				{
					status: 400,
				},
			);
		}
		throw redirect(303, '/tests/library/backlog');
	},
};
