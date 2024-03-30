import * as z from 'zod';

export const TagOnEntryModel = z.object({
	id: z.number().int(),
	tagId: z.number().int(),
	entryId: z.number().int(),
	userId: z.string(),
});
