import * as z from 'zod';

export const PasswordResetTokenModel = z.object({
	id: z.string(),
	expires: z.bigint(),
	user_id: z.string(),
});
