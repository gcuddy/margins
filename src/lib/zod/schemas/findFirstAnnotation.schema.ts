import { z } from 'zod';
import { AnnotationOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './objects/AnnotationOrderByWithRelationAndSearchRelevanceInput.schema';
import { AnnotationWhereInputObjectSchema } from './objects/AnnotationWhereInput.schema';
import { AnnotationWhereUniqueInputObjectSchema } from './objects/AnnotationWhereUniqueInput.schema';
import { AnnotationScalarFieldEnumSchema } from './enums/AnnotationScalarFieldEnum.schema';

export const AnnotationFindFirstSchema = z.object({
	orderBy: z
		.union([
			AnnotationOrderByWithRelationAndSearchRelevanceInputObjectSchema,
			AnnotationOrderByWithRelationAndSearchRelevanceInputObjectSchema.array(),
		])
		.optional(),
	where: AnnotationWhereInputObjectSchema.optional(),
	cursor: AnnotationWhereUniqueInputObjectSchema.optional(),
	take: z.number().optional(),
	skip: z.number().optional(),
	distinct: z.array(AnnotationScalarFieldEnumSchema).optional(),
});
