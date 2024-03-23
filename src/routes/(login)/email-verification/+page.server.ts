import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/db';
import type { User } from 'lucia';
import { isWithinExpirationDate } from 'oslo';
import { auth } from '$lib/server/lucia';

export const load = (async ({ locals }) => {
	if (!locals.user) {
		redirect(302, '/login');
	}
	if (locals.user.emailVerified) {
		redirect(302, '/profile');
	}
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async ({ locals, request, cookies }) => {
		if (!locals.user) {
			return fail(400);
		}

		const formData = await request.formData();

		const code = formData.get('code');

		if (typeof code !== 'string') {
			return fail(400);
		}

		const validCode = await verifyEmailCode({ code, user: locals.user });

		if (!validCode) {
			return fail(400);
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
