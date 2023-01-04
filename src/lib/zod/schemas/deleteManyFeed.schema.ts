import { z } from 'zod';
import { FeedWhereInputObjectSchema } from './objects/FeedWhereInput.schema';

export const FeedDeleteManySchema = z.object({ where: FeedWhereInputObjectSchema.optional() });
