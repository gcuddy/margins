import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { TaggingCountOrderByAggregateInputObjectSchema } from './TaggingCountOrderByAggregateInput.schema';
import { TaggingAvgOrderByAggregateInputObjectSchema } from './TaggingAvgOrderByAggregateInput.schema';
import { TaggingMaxOrderByAggregateInputObjectSchema } from './TaggingMaxOrderByAggregateInput.schema';
import { TaggingMinOrderByAggregateInputObjectSchema } from './TaggingMinOrderByAggregateInput.schema';
import { TaggingSumOrderByAggregateInputObjectSchema } from './TaggingSumOrderByAggregateInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.TaggingOrderByWithAggregationInput> = z
	.object({
		id: z.lazy(() => SortOrderSchema).optional(),
		tagId: z.lazy(() => SortOrderSchema).optional(),
		userId: z.lazy(() => SortOrderSchema).optional(),
		feedId: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		annotationId: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		bookmarkId: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		_count: z.lazy(() => TaggingCountOrderByAggregateInputObjectSchema).optional(),
		_avg: z.lazy(() => TaggingAvgOrderByAggregateInputObjectSchema).optional(),
		_max: z.lazy(() => TaggingMaxOrderByAggregateInputObjectSchema).optional(),
		_min: z.lazy(() => TaggingMinOrderByAggregateInputObjectSchema).optional(),
		_sum: z.lazy(() => TaggingSumOrderByAggregateInputObjectSchema).optional(),
	})
	.strict();

export const TaggingOrderByWithAggregationInputObjectSchema = Schema;
