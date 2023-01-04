import { z } from 'zod';
import { FeedWhereUniqueInputObjectSchema } from './objects/FeedWhereUniqueInput.schema';
import { FeedCreateInputObjectSchema } from './objects/FeedCreateInput.schema';
import { FeedUncheckedCreateInputObjectSchema } from './objects/FeedUncheckedCreateInput.schema';
import { FeedUpdateInputObjectSchema } from './objects/FeedUpdateInput.schema';
import { FeedUncheckedUpdateInputObjectSchema } from './objects/FeedUncheckedUpdateInput.schema';

export const FeedUpsertSchema = z.object({
	where: FeedWhereUniqueInputObjectSchema,
	create: z.union([FeedCreateInputObjectSchema, FeedUncheckedCreateInputObjectSchema]),
	update: z.union([FeedUpdateInputObjectSchema, FeedUncheckedUpdateInputObjectSchema]),
});
