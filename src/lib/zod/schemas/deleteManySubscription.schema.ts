import { z } from 'zod';
import { SubscriptionWhereInputObjectSchema } from './objects/SubscriptionWhereInput.schema';

export const SubscriptionDeleteManySchema = z.object({
	where: SubscriptionWhereInputObjectSchema.optional(),
});
