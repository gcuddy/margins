import * as z from 'zod';

export const EntryToTagModel = z.object({
	A: z.number().int(),
	B: z.number().int(),
});
