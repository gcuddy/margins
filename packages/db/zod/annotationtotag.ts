import * as z from 'zod';

export const AnnotationToTagModel = z.object({
	A: z.string(),
	B: z.number().int(),
});
