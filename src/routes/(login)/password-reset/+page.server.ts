import { message, setError, superValidate } from 'sveltekit-superforms/server';
import { emailSchema } from './schema';
import { fail } from '@sveltejs/kit';

import { db } from '$lib/db';
import { generatePasswordResetToken } from '$lib/auth/token';
import { sendPasswordResetLink } from '$lib/auth/verification';
import type { Message } from '$lib/types/forms';

export async function load() {
	const form = await superValidate<typeof emailSchema, Message>(emailSchema);

	return {
		form,
	};
}

export const actions = {
	default: async ({ request, url }) => {
		const formData = await request.formData();

		const form = await superValidate<typeof emailSchema, Message>(
			formData,
			emailSchema,
		);

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			const storedUser = await db
				.selectFrom('auth_user')
				.where('email', '=', form.data.email.toLowerCase())
				.select('id')
				.executeTakeFirst();
			if (!storedUser) {
				setError(form, 'email', 'User does not exist');
				return fail(400, { form });
			}
			const token = await generatePasswordResetToken(storedUser.id);
			console.log({ token });
			await sendPasswordResetLink(form.data.email, token);
			return message(form, {
				status: 'success',
				text: 'Your password reset link has been sent to your email',
			});
		} catch (e) {
			return message(
				form,
				{
					text: 'An unknown error occurred',
					status: 'error',
				},
				{
					status: 500,
				},
			);
		}
	},
};
