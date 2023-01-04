import { z } from 'zod';
import { TagOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './objects/TagOrderByWithRelationAndSearchRelevanceInput.schema';
import { TagWhereInputObjectSchema } from './objects/TagWhereInput.schema';
import { TagWhereUniqueInputObjectSchema } from './objects/TagWhereUniqueInput.schema';
import { TagCountAggregateInputObjectSchema } from './objects/TagCountAggregateInput.schema';
import { TagMinAggregateInputObjectSchema } from './objects/TagMinAggregateInput.schema';
import { TagMaxAggregateInputObjectSchema } from './objects/TagMaxAggregateInput.schema';
import { TagAvgAggregateInputObjectSchema } from './objects/TagAvgAggregateInput.schema';
import { TagSumAggregateInputObjectSchema } from './objects/TagSumAggregateInput.schema';

export const TagAggregateSchema = z.object({
	orderBy: z
		.union([
			TagOrderByWithRelationAndSearchRelevanceInputObjectSchema,
			TagOrderByWithRelationAndSearchRelevanceInputObjectSchema.array(),
		])
		.optional(),
	where: TagWhereInputObjectSchema.optional(),
	cursor: TagWhereUniqueInputObjectSchema.optional(),
	take: z.number().optional(),
	skip: z.number().optional(),
	_count: z.union([z.literal(true), TagCountAggregateInputObjectSchema]).optional(),
	_min: TagMinAggregateInputObjectSchema.optional(),
	_max: TagMaxAggregateInputObjectSchema.optional(),
	_avg: TagAvgAggregateInputObjectSchema.optional(),
	_sum: TagSumAggregateInputObjectSchema.optional(),
});
