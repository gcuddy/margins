import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ContextMaxAggregateInputType> = z
	.object({
		id: z.literal(true).optional(),
		createdAt: z.literal(true).optional(),
		userId: z.literal(true).optional(),
		entryId: z.literal(true).optional(),
		feedId: z.literal(true).optional(),
		url: z.literal(true).optional(),
		description: z.literal(true).optional(),
	})
	.strict();

export const ContextMaxAggregateInputObjectSchema = Schema;
