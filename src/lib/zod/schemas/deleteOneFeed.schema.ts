import { z } from 'zod';
import { FeedWhereUniqueInputObjectSchema } from './objects/FeedWhereUniqueInput.schema';

export const FeedDeleteOneSchema = z.object({ where: FeedWhereUniqueInputObjectSchema });
