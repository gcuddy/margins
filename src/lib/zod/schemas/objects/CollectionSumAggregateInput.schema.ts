import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.CollectionSumAggregateInputType> = z
	.object({
		id: z.literal(true).optional(),
	})
	.strict();

export const CollectionSumAggregateInputObjectSchema = Schema;
