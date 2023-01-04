import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryMediaMaxAggregateInputType> = z
	.object({
		id: z.literal(true).optional(),
		url: z.literal(true).optional(),
		size: z.literal(true).optional(),
		duration: z.literal(true).optional(),
		type: z.literal(true).optional(),
		title: z.literal(true).optional(),
		documentDataId: z.literal(true).optional(),
		entryId: z.literal(true).optional(),
	})
	.strict();

export const EntryMediaMaxAggregateInputObjectSchema = Schema;
