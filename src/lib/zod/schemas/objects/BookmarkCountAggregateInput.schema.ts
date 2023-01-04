import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.BookmarkCountAggregateInputType> = z
	.object({
		id: z.literal(true).optional(),
		createdAt: z.literal(true).optional(),
		updatedAt: z.literal(true).optional(),
		context: z.literal(true).optional(),
		uri: z.literal(true).optional(),
		entryId: z.literal(true).optional(),
		userId: z.literal(true).optional(),
		sortOrder: z.literal(true).optional(),
		is_read: z.literal(true).optional(),
		progress: z.literal(true).optional(),
		data: z.literal(true).optional(),
		stateId: z.literal(true).optional(),
		private: z.literal(true).optional(),
		interactionId: z.literal(true).optional(),
		favoriteId: z.literal(true).optional(),
		deleted: z.literal(true).optional(),
		_all: z.literal(true).optional(),
	})
	.strict();

export const BookmarkCountAggregateInputObjectSchema = Schema;
