import { z } from 'zod';

export const ArticleFilterSchema = z.object({
	title: z.object({
		contains: z.string().optional(),
		startsWith: z.string().optional(),
		endsWith: z.string().optional(),
		equals: z.string().optional()
	})
});

export const SmartListSchema = z.object({
	AND: z.object({})
});
