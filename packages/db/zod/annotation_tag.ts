import * as z from 'zod';

export const annotation_tagModel = z.object({
	tagId: z.number().int(),
	annotationId: z.string(),
});
