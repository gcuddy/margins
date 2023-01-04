import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ArticleAvgAggregateInputType> = z
	.object({
		id: z.literal(true).optional(),
		readProgress: z.literal(true).optional(),
		wordCount: z.literal(true).optional(),
		position: z.literal(true).optional(),
		type: z.literal(true).optional(),
		favoriteId: z.literal(true).optional(),
	})
	.strict();

export const ArticleAvgAggregateInputObjectSchema = Schema;
