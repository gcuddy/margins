import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/db';
import type { User } from 'lucia';
import { isWithinExpirationDate } from 'oslo';
import { auth } from '$lib/server/lucia';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { tokenSchema } from './schema';
import { generateEmailVerificationToken } from '$lib/auth/token';
import { sendEmailVerificationLink } from '$lib/auth/verification';

export const load = (async (event) => {
	const { locals } = event;
	if (!locals.user) {
		redirect(302, '/login');
	}
	if (locals.user.emailVerified) {
		redirect(302, '/profile');
	}

	const form = await superValidate(event, zod(tokenSchema));

	return {
		form,
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	verify: async (event) => {
		const { locals, cookies } = event;
		if (!locals.user) {
			return fail(401);
		}

		const form = await superValidate(event, zod(tokenSchema));
		if (!form.valid) {
			return fail(400, { form });
		}
		const { code } = form.data;

		const validCode = await verifyEmailCode({
			code: code.join(''),
			user: locals.user,
		});

		if (!validCode) {
			return message(
				form,
				{
					text: 'Invalid code',
					status: 'error',
				},
				{
					status: 403,
				},
			);
		}

		await auth.invalidateUserSessions(locals.user.id);
		await db
			.updateTable('user')
			.where('id', '=', locals.user.id)
			.set({
				email_verified: 1,
			})
			.execute();

		const session = await auth.createSession(locals.user.id, {});
		const sessionCookie = auth.createSessionCookie(session.id);

		cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes,
		});

		redirect(302, '/profile');
	},
	request: async (event) => {
		// TODO: rate limit
		if (!event.locals.user) {
			return fail(401);
		}

		if (event.locals.user.emailVerified) {
			return fail(403);
		}

		const token = await generateEmailVerificationToken(
			event.locals.user.id,
			event.locals.user.email,
		);
		console.log({ token });
		await sendEmailVerificationLink(event.locals.user.email, token);
		return {
			message: 'Email verification link sent. Check your email.',
		};
	},
};

async function verifyEmailCode({
	code,
	user,
}: {
	code: string;
	user: User;
}): Promise<boolean> {
	return await db.transaction().execute(async (trx) => {
		const databaseCode = await trx
			.selectFrom('EmailVerificationToken')
			.selectAll()
			.where('user_id', '=', user.id)
			.executeTakeFirst();
		if (!databaseCode || databaseCode.code !== code) {
			return false;
		}
		await db
			.deleteFrom('EmailVerificationToken')
			.where('id', '=', databaseCode.id)
			.execute();

		if (!isWithinExpirationDate(databaseCode.expires)) {
			return false;
		}
		if (databaseCode.email !== user.email) {
			return false;
		}
		return true;
	});
}
