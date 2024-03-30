import * as z from 'zod';

export const AttachmentModel = z.object({
	id: z.string(),
	createdAt: z.date(),
	updatedAt: z.date(),
	url: z.string(),
	size: z.number().int().nullish(),
	type: z.string().nullish(),
	userId: z.string(),
	bookmarkId: z.number().int().nullish(),
	title: z.string(),
});
