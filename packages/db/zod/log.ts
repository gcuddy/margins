import * as z from 'zod';

export const LogModel = z.object({
	id: z.number().int(),
	createdAt: z.date(),
	updatedAt: z.date(),
	entryId: z.number().int(),
	note: z.string().nullish(),
	userId: z.string(),
	date: z.date(),
	duration: z.number().int().nullish(),
	endingPage: z.number().int().nullish(),
	episode: z.number().int().nullish(),
	season: z.number().int().nullish(),
	startingPage: z.number().int().nullish(),
});
