import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.SubscriptionSumAggregateInputType> = z
	.object({
		id: z.literal(true).optional(),
		feedId: z.literal(true).optional(),
	})
	.strict();

export const SubscriptionSumAggregateInputObjectSchema = Schema;
