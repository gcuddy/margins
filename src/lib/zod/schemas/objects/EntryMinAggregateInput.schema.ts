import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryMinAggregateInputType> = z
	.object({
		createdAt: z.literal(true).optional(),
		author: z.literal(true).optional(),
		location: z.literal(true).optional(),
		title: z.literal(true).optional(),
		type: z.literal(true).optional(),
		updatedAt: z.literal(true).optional(),
		id: z.literal(true).optional(),
		uri: z.literal(true).optional(),
		html: z.literal(true).optional(),
		text: z.literal(true).optional(),
		image: z.literal(true).optional(),
		guid: z.literal(true).optional(),
		wordCount: z.literal(true).optional(),
		siteName: z.literal(true).optional(),
		summary: z.literal(true).optional(),
		published: z.literal(true).optional(),
		updated: z.literal(true).optional(),
		feedId: z.literal(true).optional(),
	})
	.strict();

export const EntryMinAggregateInputObjectSchema = Schema;
