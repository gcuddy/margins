import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { AnnotationCountOrderByAggregateInputObjectSchema } from './AnnotationCountOrderByAggregateInput.schema';
import { AnnotationAvgOrderByAggregateInputObjectSchema } from './AnnotationAvgOrderByAggregateInput.schema';
import { AnnotationMaxOrderByAggregateInputObjectSchema } from './AnnotationMaxOrderByAggregateInput.schema';
import { AnnotationMinOrderByAggregateInputObjectSchema } from './AnnotationMinOrderByAggregateInput.schema';
import { AnnotationSumOrderByAggregateInputObjectSchema } from './AnnotationSumOrderByAggregateInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.AnnotationOrderByWithAggregationInput> = z
	.object({
		id: z.lazy(() => SortOrderSchema).optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
		body: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		type: z.lazy(() => SortOrderSchema).optional(),
		private: z.lazy(() => SortOrderSchema).optional(),
		target: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		entryId: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		parentId: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		deleted: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		userId: z.lazy(() => SortOrderSchema).optional(),
		sortOrder: z.lazy(() => SortOrderSchema).optional(),
		bookmarkId: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		_count: z.lazy(() => AnnotationCountOrderByAggregateInputObjectSchema).optional(),
		_avg: z.lazy(() => AnnotationAvgOrderByAggregateInputObjectSchema).optional(),
		_max: z.lazy(() => AnnotationMaxOrderByAggregateInputObjectSchema).optional(),
		_min: z.lazy(() => AnnotationMinOrderByAggregateInputObjectSchema).optional(),
		_sum: z.lazy(() => AnnotationSumOrderByAggregateInputObjectSchema).optional(),
	})
	.strict();

export const AnnotationOrderByWithAggregationInputObjectSchema = Schema;
