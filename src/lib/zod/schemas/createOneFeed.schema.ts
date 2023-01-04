import { z } from 'zod';
import { FeedCreateInputObjectSchema } from './objects/FeedCreateInput.schema';
import { FeedUncheckedCreateInputObjectSchema } from './objects/FeedUncheckedCreateInput.schema';

export const FeedCreateOneSchema = z.object({
	data: z.union([FeedCreateInputObjectSchema, FeedUncheckedCreateInputObjectSchema]),
});
