import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserSumAggregateInputType> = z
	.object({
		default_state_id: z.literal(true).optional(),
	})
	.strict();

export const UserSumAggregateInputObjectSchema = Schema;
