import { z } from 'zod';
import { FavoriteUpdateManyMutationInputObjectSchema } from './objects/FavoriteUpdateManyMutationInput.schema';
import { FavoriteWhereInputObjectSchema } from './objects/FavoriteWhereInput.schema';

export const FavoriteUpdateManySchema = z.object({
	data: FavoriteUpdateManyMutationInputObjectSchema,
	where: FavoriteWhereInputObjectSchema.optional(),
});
