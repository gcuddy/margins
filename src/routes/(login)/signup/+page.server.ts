import { fail, redirect, type Actions } from '@sveltejs/kit';

import { generateEmailVerificationToken } from '$lib/auth/token';
import { sendEmailVerificationLink } from '$lib/auth/verification';
import { db } from '$lib/db';
import { auth } from '$lib/server/lucia';
import { generateId } from 'lucia';
import { Argon2id } from 'oslo/password';
import { message, superValidate } from 'sveltekit-superforms/server';
import { createUserSchema } from '../schema';
import type { PageServerLoad } from './$types';
import { nanoid } from 'nanoid';
import { zod } from 'sveltekit-superforms/adapters';

export const load = (async () => {
	const form = await superValidate(zod(createUserSchema), {
		errors: false,
	});

	return {
		form,
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(createUserSchema));

		if (!form.valid) {
			return fail(400, { form });
		}
		try {
			// Create a new user by using email

			const { email, password } = form.data;
			// validate invite code
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

			const userId = generateId(15);
			const hashed_password = await new Argon2id().hash(password);

			await db.transaction().execute(async (trx) => {
				await trx
					.insertInto('user')
					.values({
						email,
						id: userId,
						updatedAt: new Date(),
					})
					.execute();

				await trx
					.insertInto('password')
					.values({
						id: nanoid(),
						user_id: userId,
						hashed_password,
					})
					.execute();

				// return await trx
				// 	.updateTable('InvitationCode')
				// 	.set({
				// 		used: 1,
				// 		usedById: userId,
				// 	})
				// 	.where('code', '=', inviteCode)
				// 	.execute();
			});

			const session = await auth.createSession(userId, {});
			const sessionCookie = auth.createSessionCookie(session.id);
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes,
			});

			const token = await generateEmailVerificationToken(userId);
			await sendEmailVerificationLink(email, token, event.url);
		} catch (e) {
			console.log({ e });
			return message(
				form,
				{
					status: 'error',
					text: 'Email is already in use.',
				},
				{
					status: 400,
				},
			);
		}
		redirect(303, '/library/backlog');
	},
};
