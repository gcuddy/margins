import { z } from 'zod';

export const createUserSchema = z.object({
	email: z
		.string({
			required_error: 'Email is required',
		})
		.email({
			message: 'Email is invalid',
		}),
	password: z
		.string({
			required_error: 'Password is required',
		})
		.min(6, {
			message: 'Password must be at least 6 characters',
		})
		.max(40, {
			message: 'Password must be at most 40 characters',
		}),
	username: z
		.string({
			required_error: 'Username is required',
		})
		.min(3, {
			message: 'Username must be at least 3 characters',
		})
		.max(20, {
			message: 'Username must be at most 20 characters',
		}),
	// FOR NOW, required
	inviteCode: z
		.string({
			required_error: 'Invite code is required',
		})
		.optional(),
});

export const loginUserSchema = createUserSchema.omit({
	username: true,
	inviteCode: true,
});
