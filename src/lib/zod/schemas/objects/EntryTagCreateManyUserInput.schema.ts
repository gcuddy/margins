import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryTagCreateManyUserInput> = z
	.object({
		createdAt: z.date().optional(),
		updatedAt: z.date().optional(),
		tagId: z.number(),
		entryId: z.number(),
	})
	.strict();

export const EntryTagCreateManyUserInputObjectSchema = Schema;
