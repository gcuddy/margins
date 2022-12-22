import { z } from 'zod';

export const entryData = z.object({
	html: z.string().optional(),
	text: z.string().optional(),
	wordCount: z.number(),
	title: z.string().optional().nullable(),
	summary: z.string().optional().nullable(),
	image: z.string().optional().nullable(),
	url: z.string().optional().nullable(),
	author: z.string().optional().nullable(),
	published: z.date().or(z.string().datetime()).optional().nullable(),
	siteName: z.string().optional().nullable(),
});
