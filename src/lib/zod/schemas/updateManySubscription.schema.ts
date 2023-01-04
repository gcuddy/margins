import { z } from 'zod';
import { SubscriptionUpdateManyMutationInputObjectSchema } from './objects/SubscriptionUpdateManyMutationInput.schema';
import { SubscriptionWhereInputObjectSchema } from './objects/SubscriptionWhereInput.schema';

export const SubscriptionUpdateManySchema = z.object({
	data: SubscriptionUpdateManyMutationInputObjectSchema,
	where: SubscriptionWhereInputObjectSchema.optional(),
});
