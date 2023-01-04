import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { EntryMediaCountOrderByAggregateInputObjectSchema } from './EntryMediaCountOrderByAggregateInput.schema';
import { EntryMediaAvgOrderByAggregateInputObjectSchema } from './EntryMediaAvgOrderByAggregateInput.schema';
import { EntryMediaMaxOrderByAggregateInputObjectSchema } from './EntryMediaMaxOrderByAggregateInput.schema';
import { EntryMediaMinOrderByAggregateInputObjectSchema } from './EntryMediaMinOrderByAggregateInput.schema';
import { EntryMediaSumOrderByAggregateInputObjectSchema } from './EntryMediaSumOrderByAggregateInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryMediaOrderByWithAggregationInput> = z
	.object({
		id: z.lazy(() => SortOrderSchema).optional(),
		url: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		size: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		duration: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		type: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		title: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		documentDataId: z.lazy(() => SortOrderSchema).optional(),
		entryId: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		_count: z.lazy(() => EntryMediaCountOrderByAggregateInputObjectSchema).optional(),
		_avg: z.lazy(() => EntryMediaAvgOrderByAggregateInputObjectSchema).optional(),
		_max: z.lazy(() => EntryMediaMaxOrderByAggregateInputObjectSchema).optional(),
		_min: z.lazy(() => EntryMediaMinOrderByAggregateInputObjectSchema).optional(),
		_sum: z.lazy(() => EntryMediaSumOrderByAggregateInputObjectSchema).optional(),
	})
	.strict();

export const EntryMediaOrderByWithAggregationInputObjectSchema = Schema;
