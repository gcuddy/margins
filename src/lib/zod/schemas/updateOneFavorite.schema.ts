import { z } from 'zod';
import { FavoriteUpdateInputObjectSchema } from './objects/FavoriteUpdateInput.schema';
import { FavoriteUncheckedUpdateInputObjectSchema } from './objects/FavoriteUncheckedUpdateInput.schema';
import { FavoriteWhereUniqueInputObjectSchema } from './objects/FavoriteWhereUniqueInput.schema';

export const FavoriteUpdateOneSchema = z.object({
	data: z.union([FavoriteUpdateInputObjectSchema, FavoriteUncheckedUpdateInputObjectSchema]),
	where: FavoriteWhereUniqueInputObjectSchema,
});
