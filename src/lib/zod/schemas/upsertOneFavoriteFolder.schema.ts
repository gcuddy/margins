import { z } from 'zod';
import { FavoriteFolderWhereUniqueInputObjectSchema } from './objects/FavoriteFolderWhereUniqueInput.schema';
import { FavoriteFolderCreateInputObjectSchema } from './objects/FavoriteFolderCreateInput.schema';
import { FavoriteFolderUncheckedCreateInputObjectSchema } from './objects/FavoriteFolderUncheckedCreateInput.schema';
import { FavoriteFolderUpdateInputObjectSchema } from './objects/FavoriteFolderUpdateInput.schema';
import { FavoriteFolderUncheckedUpdateInputObjectSchema } from './objects/FavoriteFolderUncheckedUpdateInput.schema';

export const FavoriteFolderUpsertSchema = z.object({
	where: FavoriteFolderWhereUniqueInputObjectSchema,
	create: z.union([
		FavoriteFolderCreateInputObjectSchema,
		FavoriteFolderUncheckedCreateInputObjectSchema,
	]),
	update: z.union([
		FavoriteFolderUpdateInputObjectSchema,
		FavoriteFolderUncheckedUpdateInputObjectSchema,
	]),
});
