import { z } from 'zod';
import { FeedCreateManyInputObjectSchema } from './objects/FeedCreateManyInput.schema';

export const FeedCreateManySchema = z.object({ data: FeedCreateManyInputObjectSchema });
