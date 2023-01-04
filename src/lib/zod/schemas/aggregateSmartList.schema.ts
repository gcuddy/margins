import { z } from 'zod';
import { SmartListOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './objects/SmartListOrderByWithRelationAndSearchRelevanceInput.schema';
import { SmartListWhereInputObjectSchema } from './objects/SmartListWhereInput.schema';
import { SmartListWhereUniqueInputObjectSchema } from './objects/SmartListWhereUniqueInput.schema';
import { SmartListCountAggregateInputObjectSchema } from './objects/SmartListCountAggregateInput.schema';
import { SmartListMinAggregateInputObjectSchema } from './objects/SmartListMinAggregateInput.schema';
import { SmartListMaxAggregateInputObjectSchema } from './objects/SmartListMaxAggregateInput.schema';
import { SmartListAvgAggregateInputObjectSchema } from './objects/SmartListAvgAggregateInput.schema';
import { SmartListSumAggregateInputObjectSchema } from './objects/SmartListSumAggregateInput.schema';

export const SmartListAggregateSchema = z.object({
	orderBy: z
		.union([
			SmartListOrderByWithRelationAndSearchRelevanceInputObjectSchema,
			SmartListOrderByWithRelationAndSearchRelevanceInputObjectSchema.array(),
		])
		.optional(),
	where: SmartListWhereInputObjectSchema.optional(),
	cursor: SmartListWhereUniqueInputObjectSchema.optional(),
	take: z.number().optional(),
	skip: z.number().optional(),
	_count: z.union([z.literal(true), SmartListCountAggregateInputObjectSchema]).optional(),
	_min: SmartListMinAggregateInputObjectSchema.optional(),
	_max: SmartListMaxAggregateInputObjectSchema.optional(),
	_avg: SmartListAvgAggregateInputObjectSchema.optional(),
	_sum: SmartListSumAggregateInputObjectSchema.optional(),
});
