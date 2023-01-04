import { z } from 'zod';
import { FavoriteFolderWhereInputObjectSchema } from './objects/FavoriteFolderWhereInput.schema';
import { FavoriteFolderOrderByWithAggregationInputObjectSchema } from './objects/FavoriteFolderOrderByWithAggregationInput.schema';
import { FavoriteFolderScalarWhereWithAggregatesInputObjectSchema } from './objects/FavoriteFolderScalarWhereWithAggregatesInput.schema';
import { FavoriteFolderScalarFieldEnumSchema } from './enums/FavoriteFolderScalarFieldEnum.schema';

export const FavoriteFolderGroupBySchema = z.object({
	where: FavoriteFolderWhereInputObjectSchema.optional(),
	orderBy: z.union([
		FavoriteFolderOrderByWithAggregationInputObjectSchema,
		FavoriteFolderOrderByWithAggregationInputObjectSchema.array(),
	]),
	having: FavoriteFolderScalarWhereWithAggregatesInputObjectSchema.optional(),
	take: z.number().optional(),
	skip: z.number().optional(),
	by: z.array(FavoriteFolderScalarFieldEnumSchema),
});
