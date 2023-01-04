import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryTagUncheckedCreateWithoutTagInput> = z
	.object({
		createdAt: z.date().optional(),
		updatedAt: z.date().optional(),
		entryId: z.number(),
		userId: z.string(),
	})
	.strict();

export const EntryTagUncheckedCreateWithoutTagInputObjectSchema = Schema;
