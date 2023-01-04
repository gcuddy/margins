import { z } from 'zod';
import { SessionOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './objects/SessionOrderByWithRelationAndSearchRelevanceInput.schema';
import { SessionWhereInputObjectSchema } from './objects/SessionWhereInput.schema';
import { SessionWhereUniqueInputObjectSchema } from './objects/SessionWhereUniqueInput.schema';
import { SessionCountAggregateInputObjectSchema } from './objects/SessionCountAggregateInput.schema';
import { SessionMinAggregateInputObjectSchema } from './objects/SessionMinAggregateInput.schema';
import { SessionMaxAggregateInputObjectSchema } from './objects/SessionMaxAggregateInput.schema';
import { SessionAvgAggregateInputObjectSchema } from './objects/SessionAvgAggregateInput.schema';
import { SessionSumAggregateInputObjectSchema } from './objects/SessionSumAggregateInput.schema';

export const SessionAggregateSchema = z.object({
	orderBy: z
		.union([
			SessionOrderByWithRelationAndSearchRelevanceInputObjectSchema,
			SessionOrderByWithRelationAndSearchRelevanceInputObjectSchema.array(),
		])
		.optional(),
	where: SessionWhereInputObjectSchema.optional(),
	cursor: SessionWhereUniqueInputObjectSchema.optional(),
	take: z.number().optional(),
	skip: z.number().optional(),
	_count: z.union([z.literal(true), SessionCountAggregateInputObjectSchema]).optional(),
	_min: SessionMinAggregateInputObjectSchema.optional(),
	_max: SessionMaxAggregateInputObjectSchema.optional(),
	_avg: SessionAvgAggregateInputObjectSchema.optional(),
	_sum: SessionSumAggregateInputObjectSchema.optional(),
});
