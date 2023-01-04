import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ArticleCountAggregateInputType> = z
	.object({
		id: z.literal(true).optional(),
		title: z.literal(true).optional(),
		content: z.literal(true).optional(),
		textContent: z.literal(true).optional(),
		author: z.literal(true).optional(),
		private: z.literal(true).optional(),
		createdAt: z.literal(true).optional(),
		updatedAt: z.literal(true).optional(),
		readProgress: z.literal(true).optional(),
		slug: z.literal(true).optional(),
		url: z.literal(true).optional(),
		siteName: z.literal(true).optional(),
		colorHash: z.literal(true).optional(),
		date: z.literal(true).optional(),
		image: z.literal(true).optional(),
		wordCount: z.literal(true).optional(),
		starred: z.literal(true).optional(),
		css: z.literal(true).optional(),
		description: z.literal(true).optional(),
		wiki: z.literal(true).optional(),
		classification: z.literal(true).optional(),
		pdf: z.literal(true).optional(),
		html: z.literal(true).optional(),
		readLater: z.literal(true).optional(),
		bookmark: z.literal(true).optional(),
		position: z.literal(true).optional(),
		trash: z.literal(true).optional(),
		location: z.literal(true).optional(),
		type: z.literal(true).optional(),
		userId: z.literal(true).optional(),
		favoriteId: z.literal(true).optional(),
		_all: z.literal(true).optional(),
	})
	.strict();

export const ArticleCountAggregateInputObjectSchema = Schema;
