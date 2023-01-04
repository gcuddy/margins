import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.AnnotationSumAggregateInputType> = z
	.object({
		id: z.literal(true).optional(),
		entryId: z.literal(true).optional(),
		parentId: z.literal(true).optional(),
		sortOrder: z.literal(true).optional(),
		bookmarkId: z.literal(true).optional(),
	})
	.strict();

export const AnnotationSumAggregateInputObjectSchema = Schema;
