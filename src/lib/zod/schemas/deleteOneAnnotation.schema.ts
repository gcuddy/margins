import { z } from 'zod';
import { AnnotationWhereUniqueInputObjectSchema } from './objects/AnnotationWhereUniqueInput.schema';

export const AnnotationDeleteOneSchema = z.object({
	where: AnnotationWhereUniqueInputObjectSchema,
});
