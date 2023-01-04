import { z } from 'zod';
import { AnnotationUpdateInputObjectSchema } from './objects/AnnotationUpdateInput.schema';
import { AnnotationUncheckedUpdateInputObjectSchema } from './objects/AnnotationUncheckedUpdateInput.schema';
import { AnnotationWhereUniqueInputObjectSchema } from './objects/AnnotationWhereUniqueInput.schema';

export const AnnotationUpdateOneSchema = z.object({
	data: z.union([AnnotationUpdateInputObjectSchema, AnnotationUncheckedUpdateInputObjectSchema]),
	where: AnnotationWhereUniqueInputObjectSchema,
});
