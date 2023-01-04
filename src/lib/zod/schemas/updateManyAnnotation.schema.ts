import { z } from 'zod';
import { AnnotationUpdateManyMutationInputObjectSchema } from './objects/AnnotationUpdateManyMutationInput.schema';
import { AnnotationWhereInputObjectSchema } from './objects/AnnotationWhereInput.schema';

export const AnnotationUpdateManySchema = z.object({
	data: AnnotationUpdateManyMutationInputObjectSchema,
	where: AnnotationWhereInputObjectSchema.optional(),
});
