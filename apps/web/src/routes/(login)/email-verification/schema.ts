import { z } from 'zod';

export const tokenSchema = z.object({
	code: z
		.string({
			invalid_type_error: 'Code must be a string',
			required_error: 'Code is required',
		})
		.array(),
});
