import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserMinAggregateInputType> = z
	.object({
		id: z.literal(true).optional(),
		provider_id: z.literal(true).optional(),
		hashed_password: z.literal(true).optional(),
		createdAt: z.literal(true).optional(),
		updatedAt: z.literal(true).optional(),
		email: z.literal(true).optional(),
		username: z.literal(true).optional(),
		default_state_id: z.literal(true).optional(),
	})
	.strict();

export const UserMinAggregateInputObjectSchema = Schema;
