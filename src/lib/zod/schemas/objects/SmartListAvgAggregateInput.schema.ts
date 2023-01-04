import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.SmartListAvgAggregateInputType> = z
	.object({
		id: z.literal(true).optional(),
	})
	.strict();

export const SmartListAvgAggregateInputObjectSchema = Schema;
