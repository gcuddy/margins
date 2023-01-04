import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ContextNodeCreateWithoutOwnerInput> = z
	.object({
		id: z.string().optional(),
		name: z.string(),
		url: z.string().optional().nullable(),
		description: z.string().optional().nullable(),
		refers_to: z.string().optional().nullable(),
	})
	.strict();

export const ContextNodeCreateWithoutOwnerInputObjectSchema = Schema;
