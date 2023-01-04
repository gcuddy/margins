import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { BookmarkCountOrderByAggregateInputObjectSchema } from './BookmarkCountOrderByAggregateInput.schema';
import { BookmarkAvgOrderByAggregateInputObjectSchema } from './BookmarkAvgOrderByAggregateInput.schema';
import { BookmarkMaxOrderByAggregateInputObjectSchema } from './BookmarkMaxOrderByAggregateInput.schema';
import { BookmarkMinOrderByAggregateInputObjectSchema } from './BookmarkMinOrderByAggregateInput.schema';
import { BookmarkSumOrderByAggregateInputObjectSchema } from './BookmarkSumOrderByAggregateInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.BookmarkOrderByWithAggregationInput> = z
	.object({
		id: z.lazy(() => SortOrderSchema).optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
		context: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		uri: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		entryId: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		userId: z.lazy(() => SortOrderSchema).optional(),
		sortOrder: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		is_read: z.lazy(() => SortOrderSchema).optional(),
		progress: z.lazy(() => SortOrderSchema).optional(),
		data: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		stateId: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		private: z.lazy(() => SortOrderSchema).optional(),
		interactionId: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		favoriteId: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		deleted: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		_count: z.lazy(() => BookmarkCountOrderByAggregateInputObjectSchema).optional(),
		_avg: z.lazy(() => BookmarkAvgOrderByAggregateInputObjectSchema).optional(),
		_max: z.lazy(() => BookmarkMaxOrderByAggregateInputObjectSchema).optional(),
		_min: z.lazy(() => BookmarkMinOrderByAggregateInputObjectSchema).optional(),
		_sum: z.lazy(() => BookmarkSumOrderByAggregateInputObjectSchema).optional(),
	})
	.strict();

export const BookmarkOrderByWithAggregationInputObjectSchema = Schema;
