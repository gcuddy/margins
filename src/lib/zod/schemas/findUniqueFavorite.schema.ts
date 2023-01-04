import { z } from 'zod';
import { FavoriteWhereUniqueInputObjectSchema } from './objects/FavoriteWhereUniqueInput.schema';

export const FavoriteFindUniqueSchema = z.object({ where: FavoriteWhereUniqueInputObjectSchema });
