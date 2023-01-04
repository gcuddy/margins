import { z } from 'zod';
import { StateOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './objects/StateOrderByWithRelationAndSearchRelevanceInput.schema';
import { StateWhereInputObjectSchema } from './objects/StateWhereInput.schema';
import { StateWhereUniqueInputObjectSchema } from './objects/StateWhereUniqueInput.schema';
import { StateCountAggregateInputObjectSchema } from './objects/StateCountAggregateInput.schema';
import { StateMinAggregateInputObjectSchema } from './objects/StateMinAggregateInput.schema';
import { StateMaxAggregateInputObjectSchema } from './objects/StateMaxAggregateInput.schema';
import { StateAvgAggregateInputObjectSchema } from './objects/StateAvgAggregateInput.schema';
import { StateSumAggregateInputObjectSchema } from './objects/StateSumAggregateInput.schema';

export const StateAggregateSchema = z.object({
	orderBy: z
		.union([
			StateOrderByWithRelationAndSearchRelevanceInputObjectSchema,
			StateOrderByWithRelationAndSearchRelevanceInputObjectSchema.array(),
		])
		.optional(),
	where: StateWhereInputObjectSchema.optional(),
	cursor: StateWhereUniqueInputObjectSchema.optional(),
	take: z.number().optional(),
	skip: z.number().optional(),
	_count: z.union([z.literal(true), StateCountAggregateInputObjectSchema]).optional(),
	_min: StateMinAggregateInputObjectSchema.optional(),
	_max: StateMaxAggregateInputObjectSchema.optional(),
	_avg: StateAvgAggregateInputObjectSchema.optional(),
	_sum: StateSumAggregateInputObjectSchema.optional(),
});
