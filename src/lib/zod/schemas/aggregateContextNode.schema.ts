import { z } from 'zod';
import { ContextNodeOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './objects/ContextNodeOrderByWithRelationAndSearchRelevanceInput.schema';
import { ContextNodeWhereInputObjectSchema } from './objects/ContextNodeWhereInput.schema';
import { ContextNodeWhereUniqueInputObjectSchema } from './objects/ContextNodeWhereUniqueInput.schema';
import { ContextNodeCountAggregateInputObjectSchema } from './objects/ContextNodeCountAggregateInput.schema';
import { ContextNodeMinAggregateInputObjectSchema } from './objects/ContextNodeMinAggregateInput.schema';
import { ContextNodeMaxAggregateInputObjectSchema } from './objects/ContextNodeMaxAggregateInput.schema';

export const ContextNodeAggregateSchema = z.object({
	orderBy: z
		.union([
			ContextNodeOrderByWithRelationAndSearchRelevanceInputObjectSchema,
			ContextNodeOrderByWithRelationAndSearchRelevanceInputObjectSchema.array(),
		])
		.optional(),
	where: ContextNodeWhereInputObjectSchema.optional(),
	cursor: ContextNodeWhereUniqueInputObjectSchema.optional(),
	take: z.number().optional(),
	skip: z.number().optional(),
	_count: z.union([z.literal(true), ContextNodeCountAggregateInputObjectSchema]).optional(),
	_min: ContextNodeMinAggregateInputObjectSchema.optional(),
	_max: ContextNodeMaxAggregateInputObjectSchema.optional(),
});
