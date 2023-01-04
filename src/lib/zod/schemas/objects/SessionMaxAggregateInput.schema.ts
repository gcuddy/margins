import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.SessionMaxAggregateInputType> = z
	.object({
		id: z.literal(true).optional(),
		user_id: z.literal(true).optional(),
		expires: z.literal(true).optional(),
		idle_expires: z.literal(true).optional(),
	})
	.strict();

export const SessionMaxAggregateInputObjectSchema = Schema;
