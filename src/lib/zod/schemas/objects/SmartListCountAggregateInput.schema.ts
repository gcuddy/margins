import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.SmartListCountAggregateInputType> = z
	.object({
		id: z.literal(true).optional(),
		name: z.literal(true).optional(),
		filter: z.literal(true).optional(),
		viewOptions: z.literal(true).optional(),
		_all: z.literal(true).optional(),
	})
	.strict();

export const SmartListCountAggregateInputObjectSchema = Schema;
