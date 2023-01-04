import { z } from 'zod';
import { FavoriteOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './objects/FavoriteOrderByWithRelationAndSearchRelevanceInput.schema';
import { FavoriteWhereInputObjectSchema } from './objects/FavoriteWhereInput.schema';
import { FavoriteWhereUniqueInputObjectSchema } from './objects/FavoriteWhereUniqueInput.schema';
import { FavoriteCountAggregateInputObjectSchema } from './objects/FavoriteCountAggregateInput.schema';
import { FavoriteMinAggregateInputObjectSchema } from './objects/FavoriteMinAggregateInput.schema';
import { FavoriteMaxAggregateInputObjectSchema } from './objects/FavoriteMaxAggregateInput.schema';
import { FavoriteAvgAggregateInputObjectSchema } from './objects/FavoriteAvgAggregateInput.schema';
import { FavoriteSumAggregateInputObjectSchema } from './objects/FavoriteSumAggregateInput.schema';

export const FavoriteAggregateSchema = z.object({
	orderBy: z
		.union([
			FavoriteOrderByWithRelationAndSearchRelevanceInputObjectSchema,
			FavoriteOrderByWithRelationAndSearchRelevanceInputObjectSchema.array(),
		])
		.optional(),
	where: FavoriteWhereInputObjectSchema.optional(),
	cursor: FavoriteWhereUniqueInputObjectSchema.optional(),
	take: z.number().optional(),
	skip: z.number().optional(),
	_count: z.union([z.literal(true), FavoriteCountAggregateInputObjectSchema]).optional(),
	_min: FavoriteMinAggregateInputObjectSchema.optional(),
	_max: FavoriteMaxAggregateInputObjectSchema.optional(),
	_avg: FavoriteAvgAggregateInputObjectSchema.optional(),
	_sum: FavoriteSumAggregateInputObjectSchema.optional(),
});
