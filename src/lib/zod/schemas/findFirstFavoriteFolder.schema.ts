import { z } from 'zod';
import { FavoriteFolderOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './objects/FavoriteFolderOrderByWithRelationAndSearchRelevanceInput.schema';
import { FavoriteFolderWhereInputObjectSchema } from './objects/FavoriteFolderWhereInput.schema';
import { FavoriteFolderWhereUniqueInputObjectSchema } from './objects/FavoriteFolderWhereUniqueInput.schema';
import { FavoriteFolderScalarFieldEnumSchema } from './enums/FavoriteFolderScalarFieldEnum.schema';

export const FavoriteFolderFindFirstSchema = z.object({
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
	distinct: z.array(FavoriteFolderScalarFieldEnumSchema).optional(),
});
