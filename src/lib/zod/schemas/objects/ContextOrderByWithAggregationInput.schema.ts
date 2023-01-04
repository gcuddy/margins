import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { ContextCountOrderByAggregateInputObjectSchema } from './ContextCountOrderByAggregateInput.schema';
import { ContextAvgOrderByAggregateInputObjectSchema } from './ContextAvgOrderByAggregateInput.schema';
import { ContextMaxOrderByAggregateInputObjectSchema } from './ContextMaxOrderByAggregateInput.schema';
import { ContextMinOrderByAggregateInputObjectSchema } from './ContextMinOrderByAggregateInput.schema';
import { ContextSumOrderByAggregateInputObjectSchema } from './ContextSumOrderByAggregateInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ContextOrderByWithAggregationInput> = z
	.object({
		id: z.lazy(() => SortOrderSchema).optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		userId: z.lazy(() => SortOrderSchema).optional(),
		entryId: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		feedId: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		url: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		description: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		_count: z.lazy(() => ContextCountOrderByAggregateInputObjectSchema).optional(),
		_avg: z.lazy(() => ContextAvgOrderByAggregateInputObjectSchema).optional(),
		_max: z.lazy(() => ContextMaxOrderByAggregateInputObjectSchema).optional(),
		_min: z.lazy(() => ContextMinOrderByAggregateInputObjectSchema).optional(),
		_sum: z.lazy(() => ContextSumOrderByAggregateInputObjectSchema).optional(),
	})
	.strict();

export const ContextOrderByWithAggregationInputObjectSchema = Schema;
