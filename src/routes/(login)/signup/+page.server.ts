import { fail, redirect, type Actions } from '@sveltejs/kit';

import { generateEmailVerificationToken } from '$lib/auth/token';
import { sendEmailVerificationLink } from '$lib/auth/verification';
import { db } from '$lib/db';
import { auth } from '$lib/server/lucia';
import type { Message } from '$lib/types/forms';
import { createKeyId } from 'lucia';
import { generateLuciaPasswordHash, generateRandomString } from 'lucia/utils';
import { message, setError, superValidate } from 'sveltekit-superforms/server';
import { createUserSchema } from '../schema';

export async function load({ url }) {
	const inviteCode = url.searchParams.get('inviteCode');
	const form = await superValidate<typeof createUserSchema, Message>(
		url,
		createUserSchema,
		{
			errors: false,
		},
	);

	// Make our own to allow for invite code to be passed in
	// const form: SuperValidated<typeof createUserSchema, Message> = {
	// 	valid: true,
	// 	posted: false,
	// 	data: {
	// 		inviteCode: inviteCode || '',
	// 		email: '',
	// 		password: '',
	// 		username: '',
	// 	},
	// 	errors: {},
	// 	constraints: {},
	// };

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
			// TEMPORARILY TURNING THIS OFF FOR TESTING
			// const code = await db
			// 	.selectFrom('InvitationCode')
			// 	.where('used', '=', 0)
			// 	.where('code', '=', inviteCode)
			// 	.select(['code'])
			// 	.executeTakeFirst();

			// if (!code) {
			// 	return setError(form, 'inviteCode', 'Invalid invite code');
			// }

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
			const token = await generateEmailVerificationToken(userId);
			await sendEmailVerificationLink(email, token, event.url);

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
		throw redirect(303, '/library/backlog');
	},
};
