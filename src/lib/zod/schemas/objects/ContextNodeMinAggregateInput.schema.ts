import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ContextNodeMinAggregateInputType> = z
	.object({
		id: z.literal(true).optional(),
		name: z.literal(true).optional(),
		url: z.literal(true).optional(),
		description: z.literal(true).optional(),
		userId: z.literal(true).optional(),
		refers_to: z.literal(true).optional(),
	})
	.strict();

export const ContextNodeMinAggregateInputObjectSchema = Schema;
