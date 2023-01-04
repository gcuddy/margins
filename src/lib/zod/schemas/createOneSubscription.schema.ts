import { z } from 'zod';
import { SubscriptionCreateInputObjectSchema } from './objects/SubscriptionCreateInput.schema';
import { SubscriptionUncheckedCreateInputObjectSchema } from './objects/SubscriptionUncheckedCreateInput.schema';

export const SubscriptionCreateOneSchema = z.object({
	data: z.union([
		SubscriptionCreateInputObjectSchema,
		SubscriptionUncheckedCreateInputObjectSchema,
	]),
});
