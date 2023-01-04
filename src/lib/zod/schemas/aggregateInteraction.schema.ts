import { z } from 'zod';
import { InteractionOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './objects/InteractionOrderByWithRelationAndSearchRelevanceInput.schema';
import { InteractionWhereInputObjectSchema } from './objects/InteractionWhereInput.schema';
import { InteractionWhereUniqueInputObjectSchema } from './objects/InteractionWhereUniqueInput.schema';
import { InteractionCountAggregateInputObjectSchema } from './objects/InteractionCountAggregateInput.schema';
import { InteractionMinAggregateInputObjectSchema } from './objects/InteractionMinAggregateInput.schema';
import { InteractionMaxAggregateInputObjectSchema } from './objects/InteractionMaxAggregateInput.schema';
import { InteractionAvgAggregateInputObjectSchema } from './objects/InteractionAvgAggregateInput.schema';
import { InteractionSumAggregateInputObjectSchema } from './objects/InteractionSumAggregateInput.schema';

export const InteractionAggregateSchema = z.object({
	orderBy: z
		.union([
			InteractionOrderByWithRelationAndSearchRelevanceInputObjectSchema,
			InteractionOrderByWithRelationAndSearchRelevanceInputObjectSchema.array(),
		])
		.optional(),
	where: InteractionWhereInputObjectSchema.optional(),
	cursor: InteractionWhereUniqueInputObjectSchema.optional(),
	take: z.number().optional(),
	skip: z.number().optional(),
	_count: z.union([z.literal(true), InteractionCountAggregateInputObjectSchema]).optional(),
	_min: InteractionMinAggregateInputObjectSchema.optional(),
	_max: InteractionMaxAggregateInputObjectSchema.optional(),
	_avg: InteractionAvgAggregateInputObjectSchema.optional(),
	_sum: InteractionSumAggregateInputObjectSchema.optional(),
});
