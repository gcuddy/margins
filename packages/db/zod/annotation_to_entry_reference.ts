import * as z from 'zod';

export const annotation_to_entry_referenceModel = z.object({
	createdAt: z.date(),
	updatedAt: z.date(),
	entryId: z.number().int(),
	annotationId: z.string(),
});
