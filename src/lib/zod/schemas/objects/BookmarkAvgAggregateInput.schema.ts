import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.BookmarkAvgAggregateInputType> = z
	.object({
		id: z.literal(true).optional(),
		entryId: z.literal(true).optional(),
		sortOrder: z.literal(true).optional(),
		progress: z.literal(true).optional(),
		stateId: z.literal(true).optional(),
		interactionId: z.literal(true).optional(),
		favoriteId: z.literal(true).optional(),
	})
	.strict();

export const BookmarkAvgAggregateInputObjectSchema = Schema;
