import { z } from 'zod';
import { TaggingWhereInputObjectSchema } from './objects/TaggingWhereInput.schema';
import { TaggingOrderByWithAggregationInputObjectSchema } from './objects/TaggingOrderByWithAggregationInput.schema';
import { TaggingScalarWhereWithAggregatesInputObjectSchema } from './objects/TaggingScalarWhereWithAggregatesInput.schema';
import { TaggingScalarFieldEnumSchema } from './enums/TaggingScalarFieldEnum.schema';

export const TaggingGroupBySchema = z.object({
	where: TaggingWhereInputObjectSchema.optional(),
	orderBy: z.union([
		TaggingOrderByWithAggregationInputObjectSchema,
		TaggingOrderByWithAggregationInputObjectSchema.array(),
	]),
	having: TaggingScalarWhereWithAggregatesInputObjectSchema.optional(),
	take: z.number().optional(),
	skip: z.number().optional(),
	by: z.array(TaggingScalarFieldEnumSchema),
});
