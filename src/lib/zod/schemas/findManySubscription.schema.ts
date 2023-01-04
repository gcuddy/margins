import { z } from 'zod';
import { SubscriptionOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './objects/SubscriptionOrderByWithRelationAndSearchRelevanceInput.schema';
import { SubscriptionWhereInputObjectSchema } from './objects/SubscriptionWhereInput.schema';
import { SubscriptionWhereUniqueInputObjectSchema } from './objects/SubscriptionWhereUniqueInput.schema';
import { SubscriptionScalarFieldEnumSchema } from './enums/SubscriptionScalarFieldEnum.schema';

export const SubscriptionFindManySchema = z.object({
	orderBy: z
		.union([
			SubscriptionOrderByWithRelationAndSearchRelevanceInputObjectSchema,
			SubscriptionOrderByWithRelationAndSearchRelevanceInputObjectSchema.array(),
		])
		.optional(),
	where: SubscriptionWhereInputObjectSchema.optional(),
	cursor: SubscriptionWhereUniqueInputObjectSchema.optional(),
	take: z.number().optional(),
	skip: z.number().optional(),
	distinct: z.array(SubscriptionScalarFieldEnumSchema).optional(),
});
