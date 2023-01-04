import { z } from 'zod';
import { FavoriteWhereUniqueInputObjectSchema } from './objects/FavoriteWhereUniqueInput.schema';

export const FavoriteDeleteOneSchema = z.object({ where: FavoriteWhereUniqueInputObjectSchema });
