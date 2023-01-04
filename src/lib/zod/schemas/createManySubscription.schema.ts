import { z } from 'zod';
import { SubscriptionCreateManyInputObjectSchema } from './objects/SubscriptionCreateManyInput.schema';

export const SubscriptionCreateManySchema = z.object({
	data: SubscriptionCreateManyInputObjectSchema,
});
