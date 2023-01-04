import { z } from 'zod';
import { AnnotationWhereInputObjectSchema } from './objects/AnnotationWhereInput.schema';

export const AnnotationDeleteManySchema = z.object({
	where: AnnotationWhereInputObjectSchema.optional(),
});
