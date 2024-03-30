import * as z from 'zod';

export const PasswordModel = z.object({
	id: z.string(),
	hashed_password: z.string(),
	user_id: z.string(),
});
