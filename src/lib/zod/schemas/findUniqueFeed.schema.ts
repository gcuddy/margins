import { z } from 'zod';
import { FeedWhereUniqueInputObjectSchema } from './objects/FeedWhereUniqueInput.schema';

export const FeedFindUniqueSchema = z.object({ where: FeedWhereUniqueInputObjectSchema });
