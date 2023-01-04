import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.CollectionAvgAggregateInputType> = z
	.object({
		id: z.literal(true).optional(),
	})
	.strict();

export const CollectionAvgAggregateInputObjectSchema = Schema;
