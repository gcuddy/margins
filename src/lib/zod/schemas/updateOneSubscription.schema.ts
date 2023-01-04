import { z } from 'zod';
import { SubscriptionUpdateInputObjectSchema } from './objects/SubscriptionUpdateInput.schema';
import { SubscriptionUncheckedUpdateInputObjectSchema } from './objects/SubscriptionUncheckedUpdateInput.schema';
import { SubscriptionWhereUniqueInputObjectSchema } from './objects/SubscriptionWhereUniqueInput.schema';

export const SubscriptionUpdateOneSchema = z.object({
	data: z.union([
		SubscriptionUpdateInputObjectSchema,
		SubscriptionUncheckedUpdateInputObjectSchema,
	]),
	where: SubscriptionWhereUniqueInputObjectSchema,
});
