import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FeedSumAggregateInputType> = z
	.object({
		id: z.literal(true).optional(),
		velocity: z.literal(true).optional(),
	})
	.strict();

export const FeedSumAggregateInputObjectSchema = Schema;
