import { z } from 'zod';
import { AnnotationCreateInputObjectSchema } from './objects/AnnotationCreateInput.schema';
import { AnnotationUncheckedCreateInputObjectSchema } from './objects/AnnotationUncheckedCreateInput.schema';

export const AnnotationCreateOneSchema = z.object({
	data: z.union([AnnotationCreateInputObjectSchema, AnnotationUncheckedCreateInputObjectSchema]),
});
