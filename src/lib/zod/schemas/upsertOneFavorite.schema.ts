import { z } from 'zod';
import { FavoriteWhereUniqueInputObjectSchema } from './objects/FavoriteWhereUniqueInput.schema';
import { FavoriteCreateInputObjectSchema } from './objects/FavoriteCreateInput.schema';
import { FavoriteUncheckedCreateInputObjectSchema } from './objects/FavoriteUncheckedCreateInput.schema';
import { FavoriteUpdateInputObjectSchema } from './objects/FavoriteUpdateInput.schema';
import { FavoriteUncheckedUpdateInputObjectSchema } from './objects/FavoriteUncheckedUpdateInput.schema';

export const FavoriteUpsertSchema = z.object({
	where: FavoriteWhereUniqueInputObjectSchema,
	create: z.union([FavoriteCreateInputObjectSchema, FavoriteUncheckedCreateInputObjectSchema]),
	update: z.union([FavoriteUpdateInputObjectSchema, FavoriteUncheckedUpdateInputObjectSchema]),
});
