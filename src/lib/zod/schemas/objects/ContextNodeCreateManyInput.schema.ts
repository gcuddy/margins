import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ContextNodeCreateManyInput> = z
	.object({
		id: z.string().optional(),
		name: z.string(),
		url: z.string().optional().nullable(),
		description: z.string().optional().nullable(),
		userId: z.string(),
		refers_to: z.string().optional().nullable(),
	})
	.strict();

export const ContextNodeCreateManyInputObjectSchema = Schema;
