import { z } from 'zod';
import { SubscriptionOrderByRelevanceFieldEnumSchema } from '../enums/SubscriptionOrderByRelevanceFieldEnum.schema';
import { SortOrderSchema } from '../enums/SortOrder.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.SubscriptionOrderByRelevanceInput> = z
	.object({
		fields: z.union([
			z.lazy(() => SubscriptionOrderByRelevanceFieldEnumSchema),
			z.lazy(() => SubscriptionOrderByRelevanceFieldEnumSchema).array(),
		]),
		sort: z.lazy(() => SortOrderSchema),
		search: z.string(),
	})
	.strict();

export const SubscriptionOrderByRelevanceInputObjectSchema = Schema;
