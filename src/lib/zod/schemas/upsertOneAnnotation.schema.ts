import { z } from 'zod';
import { AnnotationWhereUniqueInputObjectSchema } from './objects/AnnotationWhereUniqueInput.schema';
import { AnnotationCreateInputObjectSchema } from './objects/AnnotationCreateInput.schema';
import { AnnotationUncheckedCreateInputObjectSchema } from './objects/AnnotationUncheckedCreateInput.schema';
import { AnnotationUpdateInputObjectSchema } from './objects/AnnotationUpdateInput.schema';
import { AnnotationUncheckedUpdateInputObjectSchema } from './objects/AnnotationUncheckedUpdateInput.schema';

export const AnnotationUpsertSchema = z.object({
	where: AnnotationWhereUniqueInputObjectSchema,
	create: z.union([AnnotationCreateInputObjectSchema, AnnotationUncheckedCreateInputObjectSchema]),
	update: z.union([AnnotationUpdateInputObjectSchema, AnnotationUncheckedUpdateInputObjectSchema]),
});
