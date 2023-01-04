import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.CollectionItemsSumAggregateInputType> = z
	.object({
		id: z.literal(true).optional(),
		collectionId: z.literal(true).optional(),
		position: z.literal(true).optional(),
		annotationId: z.literal(true).optional(),
		bookmarkId: z.literal(true).optional(),
	})
	.strict();

export const CollectionItemsSumAggregateInputObjectSchema = Schema;
