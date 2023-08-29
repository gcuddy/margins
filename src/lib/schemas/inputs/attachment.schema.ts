import { z } from 'zod';

export const attachmentCreateInput = z.object({
	url: z.string(),
	title: z.string(),
	bookmarkId: z.number().int().optional(),
	id: z.string().optional(),
});
