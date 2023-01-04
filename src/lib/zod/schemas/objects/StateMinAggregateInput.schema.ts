import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.StateMinAggregateInputType> = z
	.object({
		id: z.literal(true).optional(),
		read_later: z.literal(true).optional(),
		name: z.literal(true).optional(),
		color: z.literal(true).optional(),
		type: z.literal(true).optional(),
		position: z.literal(true).optional(),
		description: z.literal(true).optional(),
		userId: z.literal(true).optional(),
		default: z.literal(true).optional(),
		createdAt: z.literal(true).optional(),
		updatedAt: z.literal(true).optional(),
	})
	.strict();

export const StateMinAggregateInputObjectSchema = Schema;
