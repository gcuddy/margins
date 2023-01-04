import { z } from 'zod';
import { TaggingOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './objects/TaggingOrderByWithRelationAndSearchRelevanceInput.schema';
import { TaggingWhereInputObjectSchema } from './objects/TaggingWhereInput.schema';
import { TaggingWhereUniqueInputObjectSchema } from './objects/TaggingWhereUniqueInput.schema';
import { TaggingCountAggregateInputObjectSchema } from './objects/TaggingCountAggregateInput.schema';
import { TaggingMinAggregateInputObjectSchema } from './objects/TaggingMinAggregateInput.schema';
import { TaggingMaxAggregateInputObjectSchema } from './objects/TaggingMaxAggregateInput.schema';
import { TaggingAvgAggregateInputObjectSchema } from './objects/TaggingAvgAggregateInput.schema';
import { TaggingSumAggregateInputObjectSchema } from './objects/TaggingSumAggregateInput.schema';

export const TaggingAggregateSchema = z.object({
	orderBy: z
		.union([
			TaggingOrderByWithRelationAndSearchRelevanceInputObjectSchema,
			TaggingOrderByWithRelationAndSearchRelevanceInputObjectSchema.array(),
		])
		.optional(),
	where: TaggingWhereInputObjectSchema.optional(),
	cursor: TaggingWhereUniqueInputObjectSchema.optional(),
	take: z.number().optional(),
	skip: z.number().optional(),
	_count: z.union([z.literal(true), TaggingCountAggregateInputObjectSchema]).optional(),
	_min: TaggingMinAggregateInputObjectSchema.optional(),
	_max: TaggingMaxAggregateInputObjectSchema.optional(),
	_avg: TaggingAvgAggregateInputObjectSchema.optional(),
	_sum: TaggingSumAggregateInputObjectSchema.optional(),
});
