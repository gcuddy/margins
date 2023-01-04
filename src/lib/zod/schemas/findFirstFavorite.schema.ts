import { z } from 'zod';
import { FavoriteOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './objects/FavoriteOrderByWithRelationAndSearchRelevanceInput.schema';
import { FavoriteWhereInputObjectSchema } from './objects/FavoriteWhereInput.schema';
import { FavoriteWhereUniqueInputObjectSchema } from './objects/FavoriteWhereUniqueInput.schema';
import { FavoriteScalarFieldEnumSchema } from './enums/FavoriteScalarFieldEnum.schema';

export const FavoriteFindFirstSchema = z.object({
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
	distinct: z.array(FavoriteScalarFieldEnumSchema).optional(),
});
