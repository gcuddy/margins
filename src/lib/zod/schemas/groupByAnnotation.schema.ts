import { z } from 'zod';
import { AnnotationWhereInputObjectSchema } from './objects/AnnotationWhereInput.schema';
import { AnnotationOrderByWithAggregationInputObjectSchema } from './objects/AnnotationOrderByWithAggregationInput.schema';
import { AnnotationScalarWhereWithAggregatesInputObjectSchema } from './objects/AnnotationScalarWhereWithAggregatesInput.schema';
import { AnnotationScalarFieldEnumSchema } from './enums/AnnotationScalarFieldEnum.schema';

export const AnnotationGroupBySchema = z.object({
	where: AnnotationWhereInputObjectSchema.optional(),
	orderBy: z.union([
		AnnotationOrderByWithAggregationInputObjectSchema,
		AnnotationOrderByWithAggregationInputObjectSchema.array(),
	]),
	having: AnnotationScalarWhereWithAggregatesInputObjectSchema.optional(),
	take: z.number().optional(),
	skip: z.number().optional(),
	by: z.array(AnnotationScalarFieldEnumSchema),
});
