import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FeedAvgOrderByAggregateInput> = z
	.object({
		id: z.lazy(() => SortOrderSchema).optional(),
		velocity: z.lazy(() => SortOrderSchema).optional(),
	})
	.strict();

export const FeedAvgOrderByAggregateInputObjectSchema = Schema;
