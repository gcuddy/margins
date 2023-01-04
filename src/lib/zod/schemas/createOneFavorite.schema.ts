import { z } from 'zod';
import { FavoriteCreateInputObjectSchema } from './objects/FavoriteCreateInput.schema';
import { FavoriteUncheckedCreateInputObjectSchema } from './objects/FavoriteUncheckedCreateInput.schema';

export const FavoriteCreateOneSchema = z.object({
	data: z.union([FavoriteCreateInputObjectSchema, FavoriteUncheckedCreateInputObjectSchema]),
});
