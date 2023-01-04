import { z } from 'zod';
import { FavoriteFolderWhereUniqueInputObjectSchema } from './objects/FavoriteFolderWhereUniqueInput.schema';

export const FavoriteFolderDeleteOneSchema = z.object({
	where: FavoriteFolderWhereUniqueInputObjectSchema,
});
