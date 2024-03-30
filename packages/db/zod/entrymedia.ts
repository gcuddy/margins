import * as z from 'zod';

export const EntryMediaModel = z.object({
	id: z.number().int(),
	url: z.string().nullish(),
	size: z.number().int().nullish(),
	duration: z.number().int().nullish(),
	type: z.string().nullish(),
	title: z.string().nullish(),
	documentDataId: z.number().int(),
	entryId: z.number().int().nullish(),
});
