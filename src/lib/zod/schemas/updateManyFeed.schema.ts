import { z } from 'zod';
import { FeedUpdateManyMutationInputObjectSchema } from './objects/FeedUpdateManyMutationInput.schema';
import { FeedWhereInputObjectSchema } from './objects/FeedWhereInput.schema';

export const FeedUpdateManySchema = z.object({
	data: FeedUpdateManyMutationInputObjectSchema,
	where: FeedWhereInputObjectSchema.optional(),
});
