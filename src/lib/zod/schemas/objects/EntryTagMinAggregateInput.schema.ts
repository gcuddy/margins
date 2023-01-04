import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryTagMinAggregateInputType> = z
	.object({
		createdAt: z.literal(true).optional(),
		updatedAt: z.literal(true).optional(),
		tagId: z.literal(true).optional(),
		entryId: z.literal(true).optional(),
		userId: z.literal(true).optional(),
	})
	.strict();

export const EntryTagMinAggregateInputObjectSchema = Schema;
