import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.AnnotationCountAggregateInputType> = z
	.object({
		id: z.literal(true).optional(),
		createdAt: z.literal(true).optional(),
		updatedAt: z.literal(true).optional(),
		body: z.literal(true).optional(),
		type: z.literal(true).optional(),
		private: z.literal(true).optional(),
		target: z.literal(true).optional(),
		entryId: z.literal(true).optional(),
		parentId: z.literal(true).optional(),
		deleted: z.literal(true).optional(),
		userId: z.literal(true).optional(),
		sortOrder: z.literal(true).optional(),
		bookmarkId: z.literal(true).optional(),
		_all: z.literal(true).optional(),
	})
	.strict();

export const AnnotationCountAggregateInputObjectSchema = Schema;
