import { z } from 'zod';
import { CollectionOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './objects/CollectionOrderByWithRelationAndSearchRelevanceInput.schema';
import { CollectionWhereInputObjectSchema } from './objects/CollectionWhereInput.schema';
import { CollectionWhereUniqueInputObjectSchema } from './objects/CollectionWhereUniqueInput.schema';
import { CollectionCountAggregateInputObjectSchema } from './objects/CollectionCountAggregateInput.schema';
import { CollectionMinAggregateInputObjectSchema } from './objects/CollectionMinAggregateInput.schema';
import { CollectionMaxAggregateInputObjectSchema } from './objects/CollectionMaxAggregateInput.schema';
import { CollectionAvgAggregateInputObjectSchema } from './objects/CollectionAvgAggregateInput.schema';
import { CollectionSumAggregateInputObjectSchema } from './objects/CollectionSumAggregateInput.schema';

export const CollectionAggregateSchema = z.object({
	orderBy: z
		.union([
			CollectionOrderByWithRelationAndSearchRelevanceInputObjectSchema,
			CollectionOrderByWithRelationAndSearchRelevanceInputObjectSchema.array(),
		])
		.optional(),
	where: CollectionWhereInputObjectSchema.optional(),
	cursor: CollectionWhereUniqueInputObjectSchema.optional(),
	take: z.number().optional(),
	skip: z.number().optional(),
	_count: z.union([z.literal(true), CollectionCountAggregateInputObjectSchema]).optional(),
	_min: CollectionMinAggregateInputObjectSchema.optional(),
	_max: CollectionMaxAggregateInputObjectSchema.optional(),
	_avg: CollectionAvgAggregateInputObjectSchema.optional(),
	_sum: CollectionSumAggregateInputObjectSchema.optional(),
});
