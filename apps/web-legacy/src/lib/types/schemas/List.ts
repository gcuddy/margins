import { z } from 'zod';
const stringOrNumber = z.union([z.string(), z.number(), z.string().array(), z.number().array()]);
export const AddToListSchema = z
	.object({
		articleId: stringOrNumber,
		annotationId: stringOrNumber
	})
	.partial();
