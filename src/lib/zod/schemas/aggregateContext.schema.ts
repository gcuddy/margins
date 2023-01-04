import { z } from 'zod';
import { ContextOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './objects/ContextOrderByWithRelationAndSearchRelevanceInput.schema';
import { ContextWhereInputObjectSchema } from './objects/ContextWhereInput.schema';
import { ContextWhereUniqueInputObjectSchema } from './objects/ContextWhereUniqueInput.schema';
import { ContextCountAggregateInputObjectSchema } from './objects/ContextCountAggregateInput.schema';
import { ContextMinAggregateInputObjectSchema } from './objects/ContextMinAggregateInput.schema';
import { ContextMaxAggregateInputObjectSchema } from './objects/ContextMaxAggregateInput.schema';
import { ContextAvgAggregateInputObjectSchema } from './objects/ContextAvgAggregateInput.schema';
import { ContextSumAggregateInputObjectSchema } from './objects/ContextSumAggregateInput.schema';

export const ContextAggregateSchema = z.object({
	orderBy: z
		.union([
			ContextOrderByWithRelationAndSearchRelevanceInputObjectSchema,
			ContextOrderByWithRelationAndSearchRelevanceInputObjectSchema.array(),
		])
		.optional(),
	where: ContextWhereInputObjectSchema.optional(),
	cursor: ContextWhereUniqueInputObjectSchema.optional(),
	take: z.number().optional(),
	skip: z.number().optional(),
	_count: z.union([z.literal(true), ContextCountAggregateInputObjectSchema]).optional(),
	_min: ContextMinAggregateInputObjectSchema.optional(),
	_max: ContextMaxAggregateInputObjectSchema.optional(),
	_avg: ContextAvgAggregateInputObjectSchema.optional(),
	_sum: ContextSumAggregateInputObjectSchema.optional(),
});
