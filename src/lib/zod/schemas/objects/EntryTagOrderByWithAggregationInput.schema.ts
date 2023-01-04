import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { EntryTagCountOrderByAggregateInputObjectSchema } from './EntryTagCountOrderByAggregateInput.schema';
import { EntryTagAvgOrderByAggregateInputObjectSchema } from './EntryTagAvgOrderByAggregateInput.schema';
import { EntryTagMaxOrderByAggregateInputObjectSchema } from './EntryTagMaxOrderByAggregateInput.schema';
import { EntryTagMinOrderByAggregateInputObjectSchema } from './EntryTagMinOrderByAggregateInput.schema';
import { EntryTagSumOrderByAggregateInputObjectSchema } from './EntryTagSumOrderByAggregateInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryTagOrderByWithAggregationInput> = z
	.object({
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
		tagId: z.lazy(() => SortOrderSchema).optional(),
		entryId: z.lazy(() => SortOrderSchema).optional(),
		userId: z.lazy(() => SortOrderSchema).optional(),
		_count: z.lazy(() => EntryTagCountOrderByAggregateInputObjectSchema).optional(),
		_avg: z.lazy(() => EntryTagAvgOrderByAggregateInputObjectSchema).optional(),
		_max: z.lazy(() => EntryTagMaxOrderByAggregateInputObjectSchema).optional(),
		_min: z.lazy(() => EntryTagMinOrderByAggregateInputObjectSchema).optional(),
		_sum: z.lazy(() => EntryTagSumOrderByAggregateInputObjectSchema).optional(),
	})
	.strict();

export const EntryTagOrderByWithAggregationInputObjectSchema = Schema;
