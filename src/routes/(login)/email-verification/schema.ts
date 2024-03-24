import { z } from 'zod';

export const tokenSchema = z.object({
	code: z
		.string({
			required_error: 'Code is required',
			invalid_type_error: 'Code must be a string',
		})
		.array(),
});
