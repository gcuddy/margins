import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.SubscriptionMaxAggregateInputType> = z
	.object({
		id: z.literal(true).optional(),
		feedId: z.literal(true).optional(),
		userId: z.literal(true).optional(),
		createdAt: z.literal(true).optional(),
		updatedAt: z.literal(true).optional(),
		title: z.literal(true).optional(),
		download_full: z.literal(true).optional(),
	})
	.strict();

export const SubscriptionMaxAggregateInputObjectSchema = Schema;
