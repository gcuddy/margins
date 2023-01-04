import { z } from 'zod';
import { FeedCreateNestedOneWithoutSubscriptionsInputObjectSchema } from './FeedCreateNestedOneWithoutSubscriptionsInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.SubscriptionCreateWithoutUserInput> = z
	.object({
		feed: z.lazy(() => FeedCreateNestedOneWithoutSubscriptionsInputObjectSchema),
		createdAt: z.date().optional(),
		updatedAt: z.date().optional(),
		title: z.string(),
		download_full: z.boolean().optional(),
	})
	.strict();

export const SubscriptionCreateWithoutUserInputObjectSchema = Schema;
