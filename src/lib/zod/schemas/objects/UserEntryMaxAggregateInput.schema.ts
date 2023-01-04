import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserEntryMaxAggregateInputType> = z
	.object({
		id: z.literal(true).optional(),
	})
	.strict();

export const UserEntryMaxAggregateInputObjectSchema = Schema;
