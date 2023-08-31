import { z } from 'zod';

export const attachmentCreateInput = z.object({
	bookmarkId: z.number().int().optional(),
	id: z.string().optional(),
	title: z.string(),
	url: z.string(),
});
