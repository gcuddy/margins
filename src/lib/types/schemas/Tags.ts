import { z } from 'zod';

export const tagRequestSchema = z.object({
	ids: z.number().or(z.string()).array(),
	tags: z.string().array().optional(),
	'tag-entry': z.string().optional(),
	dontReturnTags: z.boolean().optional()
});
