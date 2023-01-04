import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryDataCountAggregateInputType> = z
	.object({
		id: z.literal(true).optional(),
		html: z.literal(true).optional(),
		text: z.literal(true).optional(),
		custom: z.literal(true).optional(),
		image: z.literal(true).optional(),
		wordCount: z.literal(true).optional(),
		summary: z.literal(true).optional(),
		data: z.literal(true).optional(),
		published: z.literal(true).optional(),
		updated: z.literal(true).optional(),
		createdAt: z.literal(true).optional(),
		updatedAt: z.literal(true).optional(),
		entryId: z.literal(true).optional(),
		userId: z.literal(true).optional(),
		_all: z.literal(true).optional(),
	})
	.strict();

export const EntryDataCountAggregateInputObjectSchema = Schema;
