import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.InteractionUncheckedCreateWithoutBookmarkInput> = z
	.object({
		id: z.number().optional(),
		createdAt: z.date().optional(),
		updatedAt: z.date().optional(),
		is_read: z.boolean().optional().nullable(),
		progress: z.number().optional().nullable(),
		finished: z.boolean().optional().nullable(),
		entryId: z.number(),
		userId: z.string(),
		last_viewed: z.date().optional(),
		last_annotated: z.date().optional(),
		last_interaction: z.date().optional(),
	})
	.strict();

export const InteractionUncheckedCreateWithoutBookmarkInputObjectSchema = Schema;
