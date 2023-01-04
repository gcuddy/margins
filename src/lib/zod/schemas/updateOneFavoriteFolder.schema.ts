import { z } from 'zod';
import { FavoriteFolderUpdateInputObjectSchema } from './objects/FavoriteFolderUpdateInput.schema';
import { FavoriteFolderUncheckedUpdateInputObjectSchema } from './objects/FavoriteFolderUncheckedUpdateInput.schema';
import { FavoriteFolderWhereUniqueInputObjectSchema } from './objects/FavoriteFolderWhereUniqueInput.schema';

export const FavoriteFolderUpdateOneSchema = z.object({
	data: z.union([
		FavoriteFolderUpdateInputObjectSchema,
		FavoriteFolderUncheckedUpdateInputObjectSchema,
	]),
	where: FavoriteFolderWhereUniqueInputObjectSchema,
});
