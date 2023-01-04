import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.TaggingAvgAggregateInputType> = z
	.object({
		id: z.literal(true).optional(),
		tagId: z.literal(true).optional(),
		feedId: z.literal(true).optional(),
		annotationId: z.literal(true).optional(),
		bookmarkId: z.literal(true).optional(),
	})
	.strict();

export const TaggingAvgAggregateInputObjectSchema = Schema;
