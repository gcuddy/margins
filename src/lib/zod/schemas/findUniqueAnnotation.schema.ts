import { z } from 'zod';
import { AnnotationWhereUniqueInputObjectSchema } from './objects/AnnotationWhereUniqueInput.schema';

export const AnnotationFindUniqueSchema = z.object({
	where: AnnotationWhereUniqueInputObjectSchema,
});
