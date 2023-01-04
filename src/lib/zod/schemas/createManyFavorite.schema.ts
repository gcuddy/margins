import { z } from 'zod';
import { FavoriteCreateManyInputObjectSchema } from './objects/FavoriteCreateManyInput.schema';

export const FavoriteCreateManySchema = z.object({ data: FavoriteCreateManyInputObjectSchema });
