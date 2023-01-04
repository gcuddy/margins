import { z } from 'zod';
import { FavoriteWhereInputObjectSchema } from './objects/FavoriteWhereInput.schema';

export const FavoriteDeleteManySchema = z.object({
	where: FavoriteWhereInputObjectSchema.optional(),
});
