import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { EntryDataCountOrderByAggregateInputObjectSchema } from './EntryDataCountOrderByAggregateInput.schema';
import { EntryDataAvgOrderByAggregateInputObjectSchema } from './EntryDataAvgOrderByAggregateInput.schema';
import { EntryDataMaxOrderByAggregateInputObjectSchema } from './EntryDataMaxOrderByAggregateInput.schema';
import { EntryDataMinOrderByAggregateInputObjectSchema } from './EntryDataMinOrderByAggregateInput.schema';
import { EntryDataSumOrderByAggregateInputObjectSchema } from './EntryDataSumOrderByAggregateInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryDataOrderByWithAggregationInput> = z
	.object({
		id: z.lazy(() => SortOrderSchema).optional(),
		html: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		text: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		custom: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		image: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		wordCount: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		summary: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		data: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		published: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		updated: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
		entryId: z.lazy(() => SortOrderSchema).optional(),
		userId: z.lazy(() => SortOrderSchema).optional(),
		_count: z.lazy(() => EntryDataCountOrderByAggregateInputObjectSchema).optional(),
		_avg: z.lazy(() => EntryDataAvgOrderByAggregateInputObjectSchema).optional(),
		_max: z.lazy(() => EntryDataMaxOrderByAggregateInputObjectSchema).optional(),
		_min: z.lazy(() => EntryDataMinOrderByAggregateInputObjectSchema).optional(),
		_sum: z.lazy(() => EntryDataSumOrderByAggregateInputObjectSchema).optional(),
	})
	.strict();

export const EntryDataOrderByWithAggregationInputObjectSchema = Schema;
