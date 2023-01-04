import { z } from 'zod';
import { SubscriptionOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './objects/SubscriptionOrderByWithRelationAndSearchRelevanceInput.schema';
import { SubscriptionWhereInputObjectSchema } from './objects/SubscriptionWhereInput.schema';
import { SubscriptionWhereUniqueInputObjectSchema } from './objects/SubscriptionWhereUniqueInput.schema';
import { SubscriptionCountAggregateInputObjectSchema } from './objects/SubscriptionCountAggregateInput.schema';
import { SubscriptionMinAggregateInputObjectSchema } from './objects/SubscriptionMinAggregateInput.schema';
import { SubscriptionMaxAggregateInputObjectSchema } from './objects/SubscriptionMaxAggregateInput.schema';
import { SubscriptionAvgAggregateInputObjectSchema } from './objects/SubscriptionAvgAggregateInput.schema';
import { SubscriptionSumAggregateInputObjectSchema } from './objects/SubscriptionSumAggregateInput.schema';

export const SubscriptionAggregateSchema = z.object({
	orderBy: z
		.union([
			SubscriptionOrderByWithRelationAndSearchRelevanceInputObjectSchema,
			SubscriptionOrderByWithRelationAndSearchRelevanceInputObjectSchema.array(),
		])
		.optional(),
	where: SubscriptionWhereInputObjectSchema.optional(),
	cursor: SubscriptionWhereUniqueInputObjectSchema.optional(),
	take: z.number().optional(),
	skip: z.number().optional(),
	_count: z.union([z.literal(true), SubscriptionCountAggregateInputObjectSchema]).optional(),
	_min: SubscriptionMinAggregateInputObjectSchema.optional(),
	_max: SubscriptionMaxAggregateInputObjectSchema.optional(),
	_avg: SubscriptionAvgAggregateInputObjectSchema.optional(),
	_sum: SubscriptionSumAggregateInputObjectSchema.optional(),
});
