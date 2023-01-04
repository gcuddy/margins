import { z } from 'zod';
import { SubscriptionWhereUniqueInputObjectSchema } from './objects/SubscriptionWhereUniqueInput.schema';

export const SubscriptionDeleteOneSchema = z.object({
	where: SubscriptionWhereUniqueInputObjectSchema,
});
