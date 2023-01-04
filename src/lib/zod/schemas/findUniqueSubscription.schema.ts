import { z } from 'zod';
import { SubscriptionWhereUniqueInputObjectSchema } from './objects/SubscriptionWhereUniqueInput.schema';

export const SubscriptionFindUniqueSchema = z.object({
	where: SubscriptionWhereUniqueInputObjectSchema,
});
