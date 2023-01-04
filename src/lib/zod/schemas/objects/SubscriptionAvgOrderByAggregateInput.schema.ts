import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.SubscriptionAvgOrderByAggregateInput> = z
	.object({
		id: z.lazy(() => SortOrderSchema).optional(),
		feedId: z.lazy(() => SortOrderSchema).optional(),
	})
	.strict();

export const SubscriptionAvgOrderByAggregateInputObjectSchema = Schema;
