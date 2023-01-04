import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { CollectionCountOrderByAggregateInputObjectSchema } from './CollectionCountOrderByAggregateInput.schema';
import { CollectionAvgOrderByAggregateInputObjectSchema } from './CollectionAvgOrderByAggregateInput.schema';
import { CollectionMaxOrderByAggregateInputObjectSchema } from './CollectionMaxOrderByAggregateInput.schema';
import { CollectionMinOrderByAggregateInputObjectSchema } from './CollectionMinOrderByAggregateInput.schema';
import { CollectionSumOrderByAggregateInputObjectSchema } from './CollectionSumOrderByAggregateInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.CollectionOrderByWithAggregationInput> = z
	.object({
		id: z.lazy(() => SortOrderSchema).optional(),
		name: z.lazy(() => SortOrderSchema).optional(),
		private: z.lazy(() => SortOrderSchema).optional(),
		icon: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		userId: z.lazy(() => SortOrderSchema).optional(),
		description: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
		_count: z.lazy(() => CollectionCountOrderByAggregateInputObjectSchema).optional(),
		_avg: z.lazy(() => CollectionAvgOrderByAggregateInputObjectSchema).optional(),
		_max: z.lazy(() => CollectionMaxOrderByAggregateInputObjectSchema).optional(),
		_min: z.lazy(() => CollectionMinOrderByAggregateInputObjectSchema).optional(),
		_sum: z.lazy(() => CollectionSumOrderByAggregateInputObjectSchema).optional(),
	})
	.strict();

export const CollectionOrderByWithAggregationInputObjectSchema = Schema;
