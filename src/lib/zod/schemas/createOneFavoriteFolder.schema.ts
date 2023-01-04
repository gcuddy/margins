import { z } from 'zod';
import { FavoriteFolderCreateInputObjectSchema } from './objects/FavoriteFolderCreateInput.schema';
import { FavoriteFolderUncheckedCreateInputObjectSchema } from './objects/FavoriteFolderUncheckedCreateInput.schema';

export const FavoriteFolderCreateOneSchema = z.object({
	data: z.union([
		FavoriteFolderCreateInputObjectSchema,
		FavoriteFolderUncheckedCreateInputObjectSchema,
	]),
});
