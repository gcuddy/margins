import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryAvgAggregateInputType> = z
	.object({
		id: z.literal(true).optional(),
		wordCount: z.literal(true).optional(),
		feedId: z.literal(true).optional(),
	})
	.strict();

export const EntryAvgAggregateInputObjectSchema = Schema;
