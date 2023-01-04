import { z } from 'zod';
import { SubscriptionWhereUniqueInputObjectSchema } from './objects/SubscriptionWhereUniqueInput.schema';
import { SubscriptionCreateInputObjectSchema } from './objects/SubscriptionCreateInput.schema';
import { SubscriptionUncheckedCreateInputObjectSchema } from './objects/SubscriptionUncheckedCreateInput.schema';
import { SubscriptionUpdateInputObjectSchema } from './objects/SubscriptionUpdateInput.schema';
import { SubscriptionUncheckedUpdateInputObjectSchema } from './objects/SubscriptionUncheckedUpdateInput.schema';

export const SubscriptionUpsertSchema = z.object({
	where: SubscriptionWhereUniqueInputObjectSchema,
	create: z.union([
		SubscriptionCreateInputObjectSchema,
		SubscriptionUncheckedCreateInputObjectSchema,
	]),
	update: z.union([
		SubscriptionUpdateInputObjectSchema,
		SubscriptionUncheckedUpdateInputObjectSchema,
	]),
});
