import { z } from 'zod';
import { FavoriteWhereInputObjectSchema } from './objects/FavoriteWhereInput.schema';
import { FavoriteOrderByWithAggregationInputObjectSchema } from './objects/FavoriteOrderByWithAggregationInput.schema';
import { FavoriteScalarWhereWithAggregatesInputObjectSchema } from './objects/FavoriteScalarWhereWithAggregatesInput.schema';
import { FavoriteScalarFieldEnumSchema } from './enums/FavoriteScalarFieldEnum.schema';

export const FavoriteGroupBySchema = z.object({
	where: FavoriteWhereInputObjectSchema.optional(),
	orderBy: z.union([
		FavoriteOrderByWithAggregationInputObjectSchema,
		FavoriteOrderByWithAggregationInputObjectSchema.array(),
	]),
	having: FavoriteScalarWhereWithAggregatesInputObjectSchema.optional(),
	take: z.number().optional(),
	skip: z.number().optional(),
	by: z.array(FavoriteScalarFieldEnumSchema),
});
