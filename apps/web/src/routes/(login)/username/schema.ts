import { z } from 'zod';

export const usernameSchema = z.object({
	username: z
		.string()
		.min(3)
		.max(30)
		.regex(/^\w+$/),
});
