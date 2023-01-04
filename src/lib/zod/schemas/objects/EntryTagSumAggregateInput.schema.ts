import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryTagSumAggregateInputType> = z
	.object({
		tagId: z.literal(true).optional(),
		entryId: z.literal(true).optional(),
	})
	.strict();

export const EntryTagSumAggregateInputObjectSchema = Schema;
