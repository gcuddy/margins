import { z } from 'zod';
import { FeedUpdateInputObjectSchema } from './objects/FeedUpdateInput.schema';
import { FeedUncheckedUpdateInputObjectSchema } from './objects/FeedUncheckedUpdateInput.schema';
import { FeedWhereUniqueInputObjectSchema } from './objects/FeedWhereUniqueInput.schema';

export const FeedUpdateOneSchema = z.object({
	data: z.union([FeedUpdateInputObjectSchema, FeedUncheckedUpdateInputObjectSchema]),
	where: FeedWhereUniqueInputObjectSchema,
});
