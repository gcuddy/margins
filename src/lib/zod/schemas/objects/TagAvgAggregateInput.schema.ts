import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.TagAvgAggregateInputType> = z
	.object({
		id: z.literal(true).optional(),
	})
	.strict();

export const TagAvgAggregateInputObjectSchema = Schema;
