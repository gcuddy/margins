import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { EntryCountOrderByAggregateInputObjectSchema } from './EntryCountOrderByAggregateInput.schema';
import { EntryAvgOrderByAggregateInputObjectSchema } from './EntryAvgOrderByAggregateInput.schema';
import { EntryMaxOrderByAggregateInputObjectSchema } from './EntryMaxOrderByAggregateInput.schema';
import { EntryMinOrderByAggregateInputObjectSchema } from './EntryMinOrderByAggregateInput.schema';
import { EntrySumOrderByAggregateInputObjectSchema } from './EntrySumOrderByAggregateInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryOrderByWithAggregationInput> = z
	.object({
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		author: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		location: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		title: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		type: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
		id: z.lazy(() => SortOrderSchema).optional(),
		uri: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		html: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		text: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		image: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		guid: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		original: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		wordCount: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		siteName: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		summary: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		media: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		published: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		updated: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		feedId: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		_count: z.lazy(() => EntryCountOrderByAggregateInputObjectSchema).optional(),
		_avg: z.lazy(() => EntryAvgOrderByAggregateInputObjectSchema).optional(),
		_max: z.lazy(() => EntryMaxOrderByAggregateInputObjectSchema).optional(),
		_min: z.lazy(() => EntryMinOrderByAggregateInputObjectSchema).optional(),
		_sum: z.lazy(() => EntrySumOrderByAggregateInputObjectSchema).optional(),
	})
	.strict();

export const EntryOrderByWithAggregationInputObjectSchema = Schema;
