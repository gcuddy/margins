import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryTagUncheckedCreateWithoutEntryInput> = z
	.object({
		createdAt: z.date().optional(),
		updatedAt: z.date().optional(),
		tagId: z.number(),
		userId: z.string(),
	})
	.strict();

export const EntryTagUncheckedCreateWithoutEntryInputObjectSchema = Schema;
