import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryTagCreateManyInput> = z
	.object({
		createdAt: z.date().optional(),
		updatedAt: z.date().optional(),
		tagId: z.number(),
		entryId: z.number(),
		userId: z.string(),
	})
	.strict();

export const EntryTagCreateManyInputObjectSchema = Schema;
