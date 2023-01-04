import { z } from 'zod';
import { FavoriteFolderOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './objects/FavoriteFolderOrderByWithRelationAndSearchRelevanceInput.schema';
import { FavoriteFolderWhereInputObjectSchema } from './objects/FavoriteFolderWhereInput.schema';
import { FavoriteFolderWhereUniqueInputObjectSchema } from './objects/FavoriteFolderWhereUniqueInput.schema';
import { FavoriteFolderCountAggregateInputObjectSchema } from './objects/FavoriteFolderCountAggregateInput.schema';
import { FavoriteFolderMinAggregateInputObjectSchema } from './objects/FavoriteFolderMinAggregateInput.schema';
import { FavoriteFolderMaxAggregateInputObjectSchema } from './objects/FavoriteFolderMaxAggregateInput.schema';
import { FavoriteFolderAvgAggregateInputObjectSchema } from './objects/FavoriteFolderAvgAggregateInput.schema';
import { FavoriteFolderSumAggregateInputObjectSchema } from './objects/FavoriteFolderSumAggregateInput.schema';

export const FavoriteFolderAggregateSchema = z.object({
	orderBy: z
		.union([
			FavoriteFolderOrderByWithRelationAndSearchRelevanceInputObjectSchema,
			FavoriteFolderOrderByWithRelationAndSearchRelevanceInputObjectSchema.array(),
		])
		.optional(),
	where: FavoriteFolderWhereInputObjectSchema.optional(),
	cursor: FavoriteFolderWhereUniqueInputObjectSchema.optional(),
	take: z.number().optional(),
	skip: z.number().optional(),
	_count: z.union([z.literal(true), FavoriteFolderCountAggregateInputObjectSchema]).optional(),
	_min: FavoriteFolderMinAggregateInputObjectSchema.optional(),
	_max: FavoriteFolderMaxAggregateInputObjectSchema.optional(),
	_avg: FavoriteFolderAvgAggregateInputObjectSchema.optional(),
	_sum: FavoriteFolderSumAggregateInputObjectSchema.optional(),
});
