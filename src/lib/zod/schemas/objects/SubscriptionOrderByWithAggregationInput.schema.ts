import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SubscriptionCountOrderByAggregateInputObjectSchema } from './SubscriptionCountOrderByAggregateInput.schema';
import { SubscriptionAvgOrderByAggregateInputObjectSchema } from './SubscriptionAvgOrderByAggregateInput.schema';
import { SubscriptionMaxOrderByAggregateInputObjectSchema } from './SubscriptionMaxOrderByAggregateInput.schema';
import { SubscriptionMinOrderByAggregateInputObjectSchema } from './SubscriptionMinOrderByAggregateInput.schema';
import { SubscriptionSumOrderByAggregateInputObjectSchema } from './SubscriptionSumOrderByAggregateInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.SubscriptionOrderByWithAggregationInput> = z
	.object({
		id: z.lazy(() => SortOrderSchema).optional(),
		feedId: z.lazy(() => SortOrderSchema).optional(),
		userId: z.lazy(() => SortOrderSchema).optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
		title: z.lazy(() => SortOrderSchema).optional(),
		download_full: z.lazy(() => SortOrderSchema).optional(),
		_count: z.lazy(() => SubscriptionCountOrderByAggregateInputObjectSchema).optional(),
		_avg: z.lazy(() => SubscriptionAvgOrderByAggregateInputObjectSchema).optional(),
		_max: z.lazy(() => SubscriptionMaxOrderByAggregateInputObjectSchema).optional(),
		_min: z.lazy(() => SubscriptionMinOrderByAggregateInputObjectSchema).optional(),
		_sum: z.lazy(() => SubscriptionSumOrderByAggregateInputObjectSchema).optional(),
	})
	.strict();

export const SubscriptionOrderByWithAggregationInputObjectSchema = Schema;
