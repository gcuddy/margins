import { z } from 'zod';
import { TagWhereInputObjectSchema } from './objects/TagWhereInput.schema';
import { TagOrderByWithAggregationInputObjectSchema } from './objects/TagOrderByWithAggregationInput.schema';
import { TagScalarWhereWithAggregatesInputObjectSchema } from './objects/TagScalarWhereWithAggregatesInput.schema';
import { TagScalarFieldEnumSchema } from './enums/TagScalarFieldEnum.schema';

export const TagGroupBySchema = z.object({
	where: TagWhereInputObjectSchema.optional(),
	orderBy: z.union([
		TagOrderByWithAggregationInputObjectSchema,
		TagOrderByWithAggregationInputObjectSchema.array(),
	]),
	having: TagScalarWhereWithAggregatesInputObjectSchema.optional(),
	take: z.number().optional(),
	skip: z.number().optional(),
	by: z.array(TagScalarFieldEnumSchema),
});
