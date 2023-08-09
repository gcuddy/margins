import { type Actions, fail } from '@sveltejs/kit';
import { z } from 'zod';

import { auth } from '$lib/server/lucia';
import { createDefaultStates } from '$lib/user';

const createUserSchema = z.object({
	email: z
		.string({
			required_error: 'Email is required'
		})
		.email({
			message: 'Email is invalid'
		}),
	password: z
		.string({
			required_error: 'Password is required'
		})
		.min(6, {
			message: 'Password must be at least 6 characters'
		})
		.max(8, {
			message: 'Password must be at most 8 characters'
		}),
	username: z
		.string({
			required_error: 'Username is required'
		})
		.min(3, {
			message: 'Username must be at least 3 characters'
		})
		.max(20, {
			message: 'Username must be at most 20 characters'
		})
});

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const formData = Object.fromEntries(await request.formData());
		try {
			// Create a new user by using email
			const result = createUserSchema.safeParse(formData);
			if (!result.success) {
				const { fieldErrors: errors } = result.error.flatten();
				const { password, ...rest } = formData;
				return fail(400, {
					...rest,
					errors
				});
			}
			const { email, password, username } = result.data;
			const user = await auth.createUser({
				key: {
					providerId: 'email',
					providerUserId: email,
					password
				},
				attributes: {
					username,
					email
				}
			});
			// const user = await auth.createUser('email', email, {
			//     password,
			//     attributes: {
			//         email,
			//         username,
			//     },
			// });
			// await createDefaultStates(user.userId);
			const session = await auth.createSession({
				userId: user.userId,
				attributes: {}
			});
			locals.auth.setSession(session);
		} catch (e) {
			console.log({ e });
			return fail(400, {
				message: 'Email/username already in use'
			});
		}
	}
};
