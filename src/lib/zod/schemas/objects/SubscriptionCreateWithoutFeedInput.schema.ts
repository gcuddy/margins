import { z } from 'zod';
import { UserCreateNestedOneWithoutSubscriptionsInputObjectSchema } from './UserCreateNestedOneWithoutSubscriptionsInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.SubscriptionCreateWithoutFeedInput> = z
	.object({
		user: z.lazy(() => UserCreateNestedOneWithoutSubscriptionsInputObjectSchema),
		createdAt: z.date().optional(),
		updatedAt: z.date().optional(),
		title: z.string(),
		download_full: z.boolean().optional(),
	})
	.strict();

export const SubscriptionCreateWithoutFeedInputObjectSchema = Schema;
