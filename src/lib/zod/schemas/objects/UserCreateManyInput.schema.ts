import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserCreateManyInput> = z
	.object({
		id: z.string().optional(),
		provider_id: z.string(),
		hashed_password: z.string().optional().nullable(),
		createdAt: z.date().optional(),
		updatedAt: z.date().optional(),
		email: z.string(),
		username: z.string(),
		default_state_id: z.number().optional().nullable(),
	})
	.strict();

export const UserCreateManyInputObjectSchema = Schema;
