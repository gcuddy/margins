import {
	isValidPasswordResetToken,
	validatePasswordResetToken,
} from '$lib/auth/token';
import { Message, createMessage } from '$lib/types/forms';
import { redirect } from 'sveltekit-flash-message/server';
import { message, superValidate } from 'sveltekit-superforms/server';
import { passwordSchema } from './schema';
import { fail } from '@sveltejs/kit';
import { auth } from '$lib/server/lucia';

export async function load(event) {
	const { token } = event.params;

	const validToken = await isValidPasswordResetToken(token);

	if (!validToken) {
		throw redirect(
			'/login',
			createMessage({
				status: 'error',
				text: 'Invalid token',
			}),
			event,
		);
	}

	const form = await superValidate<typeof passwordSchema, Message>(
		passwordSchema,
	);

	return {
		form,
	};
}

export const actions = {
	default: async ({ request, params, locals }) => {
		const formData = await request.formData();

		const form = await superValidate<typeof passwordSchema, Message>(
			formData,
			passwordSchema,
		);

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			const { token } = params;
			const userId = await validatePasswordResetToken(token);
			let user = await auth.getUser(userId);

			await auth.invalidateAllUserSessions(userId);
			await auth.updateKeyPassword('email', user.email, form.data.password);
			// await auth.updateKeyPassword(
			// 	'username',
			// 	user.username,
			// 	form.data.password,
			// );

			if (!user.emailVerified) {
				user = await auth.updateUserAttributes(userId, {
					email_verified: true,
				});
			}

			const session = await auth.createSession({
				attributes: {},
				userId: user.userId,
			});

			locals.auth.setSession(session);
		} catch (e) {
			console.error(e);
			return message(
				form,
				{
					status: 'error',
					text: 'Invalid or expired password reset link',
				},
				{ status: 400 },
			);
		}

		throw redirect(302, '/library/now');
	},
};
