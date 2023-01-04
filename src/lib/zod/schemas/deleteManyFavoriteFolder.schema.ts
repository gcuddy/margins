import { z } from 'zod';
import { FavoriteFolderWhereInputObjectSchema } from './objects/FavoriteFolderWhereInput.schema';

export const FavoriteFolderDeleteManySchema = z.object({
	where: FavoriteFolderWhereInputObjectSchema.optional(),
});
