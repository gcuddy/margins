import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ContextUncheckedCreateWithoutEntryInput> = z
	.object({
		id: z.number().optional(),
		createdAt: z.date().optional(),
		userId: z.string(),
		feedId: z.number().optional().nullable(),
		url: z.string().optional().nullable(),
		description: z.string().optional().nullable(),
	})
	.strict();

export const ContextUncheckedCreateWithoutEntryInputObjectSchema = Schema;
