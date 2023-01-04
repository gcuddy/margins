import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.InteractionMinAggregateInputType> = z
	.object({
		id: z.literal(true).optional(),
		createdAt: z.literal(true).optional(),
		updatedAt: z.literal(true).optional(),
		is_read: z.literal(true).optional(),
		progress: z.literal(true).optional(),
		finished: z.literal(true).optional(),
		entryId: z.literal(true).optional(),
		userId: z.literal(true).optional(),
		last_viewed: z.literal(true).optional(),
		last_annotated: z.literal(true).optional(),
		last_interaction: z.literal(true).optional(),
	})
	.strict();

export const InteractionMinAggregateInputObjectSchema = Schema;
