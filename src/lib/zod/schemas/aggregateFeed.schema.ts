import { z } from 'zod';
import { FeedOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './objects/FeedOrderByWithRelationAndSearchRelevanceInput.schema';
import { FeedWhereInputObjectSchema } from './objects/FeedWhereInput.schema';
import { FeedWhereUniqueInputObjectSchema } from './objects/FeedWhereUniqueInput.schema';
import { FeedCountAggregateInputObjectSchema } from './objects/FeedCountAggregateInput.schema';
import { FeedMinAggregateInputObjectSchema } from './objects/FeedMinAggregateInput.schema';
import { FeedMaxAggregateInputObjectSchema } from './objects/FeedMaxAggregateInput.schema';
import { FeedAvgAggregateInputObjectSchema } from './objects/FeedAvgAggregateInput.schema';
import { FeedSumAggregateInputObjectSchema } from './objects/FeedSumAggregateInput.schema';

export const FeedAggregateSchema = z.object({
	orderBy: z
		.union([
			FeedOrderByWithRelationAndSearchRelevanceInputObjectSchema,
			FeedOrderByWithRelationAndSearchRelevanceInputObjectSchema.array(),
		])
		.optional(),
	where: FeedWhereInputObjectSchema.optional(),
	cursor: FeedWhereUniqueInputObjectSchema.optional(),
	take: z.number().optional(),
	skip: z.number().optional(),
	_count: z.union([z.literal(true), FeedCountAggregateInputObjectSchema]).optional(),
	_min: FeedMinAggregateInputObjectSchema.optional(),
	_max: FeedMaxAggregateInputObjectSchema.optional(),
	_avg: FeedAvgAggregateInputObjectSchema.optional(),
	_sum: FeedSumAggregateInputObjectSchema.optional(),
});
