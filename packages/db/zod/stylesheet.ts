import * as z from 'zod';

export const StylesheetModel = z.object({
	id: z.number().int(),
	domain: z.string(),
	css: z.string(),
	userEntryId: z.number().int().nullish(),
	userId: z.string(),
});
