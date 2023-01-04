import { z } from 'zod';
import { CollectionItemsOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './objects/CollectionItemsOrderByWithRelationAndSearchRelevanceInput.schema';
import { CollectionItemsWhereInputObjectSchema } from './objects/CollectionItemsWhereInput.schema';
import { CollectionItemsWhereUniqueInputObjectSchema } from './objects/CollectionItemsWhereUniqueInput.schema';
import { CollectionItemsCountAggregateInputObjectSchema } from './objects/CollectionItemsCountAggregateInput.schema';
import { CollectionItemsMinAggregateInputObjectSchema } from './objects/CollectionItemsMinAggregateInput.schema';
import { CollectionItemsMaxAggregateInputObjectSchema } from './objects/CollectionItemsMaxAggregateInput.schema';
import { CollectionItemsAvgAggregateInputObjectSchema } from './objects/CollectionItemsAvgAggregateInput.schema';
import { CollectionItemsSumAggregateInputObjectSchema } from './objects/CollectionItemsSumAggregateInput.schema';

export const CollectionItemsAggregateSchema = z.object({
	orderBy: z
		.union([
			CollectionItemsOrderByWithRelationAndSearchRelevanceInputObjectSchema,
			CollectionItemsOrderByWithRelationAndSearchRelevanceInputObjectSchema.array(),
		])
		.optional(),
	where: CollectionItemsWhereInputObjectSchema.optional(),
	cursor: CollectionItemsWhereUniqueInputObjectSchema.optional(),
	take: z.number().optional(),
	skip: z.number().optional(),
	_count: z.union([z.literal(true), CollectionItemsCountAggregateInputObjectSchema]).optional(),
	_min: CollectionItemsMinAggregateInputObjectSchema.optional(),
	_max: CollectionItemsMaxAggregateInputObjectSchema.optional(),
	_avg: CollectionItemsAvgAggregateInputObjectSchema.optional(),
	_sum: CollectionItemsSumAggregateInputObjectSchema.optional(),
});
