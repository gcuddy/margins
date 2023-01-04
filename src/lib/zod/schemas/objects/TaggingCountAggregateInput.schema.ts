import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.TaggingCountAggregateInputType> = z
	.object({
		id: z.literal(true).optional(),
		tagId: z.literal(true).optional(),
		userId: z.literal(true).optional(),
		feedId: z.literal(true).optional(),
		annotationId: z.literal(true).optional(),
		bookmarkId: z.literal(true).optional(),
		_all: z.literal(true).optional(),
	})
	.strict();

export const TaggingCountAggregateInputObjectSchema = Schema;
