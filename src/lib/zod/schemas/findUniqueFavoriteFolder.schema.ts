import { z } from 'zod';
import { FavoriteFolderWhereUniqueInputObjectSchema } from './objects/FavoriteFolderWhereUniqueInput.schema';

export const FavoriteFolderFindUniqueSchema = z.object({
	where: FavoriteFolderWhereUniqueInputObjectSchema,
});
