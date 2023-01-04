import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryDataAvgAggregateInputType> = z
	.object({
		id: z.literal(true).optional(),
		wordCount: z.literal(true).optional(),
		entryId: z.literal(true).optional(),
	})
	.strict();

export const EntryDataAvgAggregateInputObjectSchema = Schema;
