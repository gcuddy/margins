import { z } from 'zod';
import { FeedCreateNestedOneWithoutSubscriptionsInputObjectSchema } from './FeedCreateNestedOneWithoutSubscriptionsInput.schema';
import { UserCreateNestedOneWithoutSubscriptionsInputObjectSchema } from './UserCreateNestedOneWithoutSubscriptionsInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.SubscriptionCreateInput> = z
	.object({
		feed: z.lazy(() => FeedCreateNestedOneWithoutSubscriptionsInputObjectSchema),
		user: z.lazy(() => UserCreateNestedOneWithoutSubscriptionsInputObjectSchema),
		createdAt: z.date().optional(),
		updatedAt: z.date().optional(),
		title: z.string(),
		download_full: z.boolean().optional(),
	})
	.strict();

export const SubscriptionCreateInputObjectSchema = Schema;
