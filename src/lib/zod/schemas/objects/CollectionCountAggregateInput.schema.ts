import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.CollectionCountAggregateInputType> = z
	.object({
		id: z.literal(true).optional(),
		name: z.literal(true).optional(),
		private: z.literal(true).optional(),
		icon: z.literal(true).optional(),
		userId: z.literal(true).optional(),
		description: z.literal(true).optional(),
		createdAt: z.literal(true).optional(),
		updatedAt: z.literal(true).optional(),
		_all: z.literal(true).optional(),
	})
	.strict();

export const CollectionCountAggregateInputObjectSchema = Schema;
