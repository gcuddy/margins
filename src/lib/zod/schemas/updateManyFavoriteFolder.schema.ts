import { z } from 'zod';
import { FavoriteFolderUpdateManyMutationInputObjectSchema } from './objects/FavoriteFolderUpdateManyMutationInput.schema';
import { FavoriteFolderWhereInputObjectSchema } from './objects/FavoriteFolderWhereInput.schema';

export const FavoriteFolderUpdateManySchema = z.object({
	data: FavoriteFolderUpdateManyMutationInputObjectSchema,
	where: FavoriteFolderWhereInputObjectSchema.optional(),
});
