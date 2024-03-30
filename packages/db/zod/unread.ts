import * as z from 'zod';

export const UnreadModel = z.object({
	id: z.number().int(),
	userId: z.string(),
	feedId: z.number().int().nullish(),
	entryId: z.number().int(),
	published: z.date(),
	entryCreatedAt: z.date(),
	createdAt: z.date(),
	updatedAt: z.date(),
});
