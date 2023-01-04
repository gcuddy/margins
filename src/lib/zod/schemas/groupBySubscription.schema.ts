import { z } from 'zod';
import { SubscriptionWhereInputObjectSchema } from './objects/SubscriptionWhereInput.schema';
import { SubscriptionOrderByWithAggregationInputObjectSchema } from './objects/SubscriptionOrderByWithAggregationInput.schema';
import { SubscriptionScalarWhereWithAggregatesInputObjectSchema } from './objects/SubscriptionScalarWhereWithAggregatesInput.schema';
import { SubscriptionScalarFieldEnumSchema } from './enums/SubscriptionScalarFieldEnum.schema';

export const SubscriptionGroupBySchema = z.object({
	where: SubscriptionWhereInputObjectSchema.optional(),
	orderBy: z.union([
		SubscriptionOrderByWithAggregationInputObjectSchema,
		SubscriptionOrderByWithAggregationInputObjectSchema.array(),
	]),
	having: SubscriptionScalarWhereWithAggregatesInputObjectSchema.optional(),
	take: z.number().optional(),
	skip: z.number().optional(),
	by: z.array(SubscriptionScalarFieldEnumSchema),
});
