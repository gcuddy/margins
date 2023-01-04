import { z } from 'zod';
import { FavoriteFolderCreateManyInputObjectSchema } from './objects/FavoriteFolderCreateManyInput.schema';

export const FavoriteFolderCreateManySchema = z.object({
	data: FavoriteFolderCreateManyInputObjectSchema,
});
