import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { TagCountOrderByAggregateInputObjectSchema } from './TagCountOrderByAggregateInput.schema';
import { TagAvgOrderByAggregateInputObjectSchema } from './TagAvgOrderByAggregateInput.schema';
import { TagMaxOrderByAggregateInputObjectSchema } from './TagMaxOrderByAggregateInput.schema';
import { TagMinOrderByAggregateInputObjectSchema } from './TagMinOrderByAggregateInput.schema';
import { TagSumOrderByAggregateInputObjectSchema } from './TagSumOrderByAggregateInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.TagOrderByWithAggregationInput> = z
	.object({
		id: z.lazy(() => SortOrderSchema).optional(),
		name: z.lazy(() => SortOrderSchema).optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
		viewOptions: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		userId: z.lazy(() => SortOrderSchema).optional(),
		_count: z.lazy(() => TagCountOrderByAggregateInputObjectSchema).optional(),
		_avg: z.lazy(() => TagAvgOrderByAggregateInputObjectSchema).optional(),
		_max: z.lazy(() => TagMaxOrderByAggregateInputObjectSchema).optional(),
		_min: z.lazy(() => TagMinOrderByAggregateInputObjectSchema).optional(),
		_sum: z.lazy(() => TagSumOrderByAggregateInputObjectSchema).optional(),
	})
	.strict();

export const TagOrderByWithAggregationInputObjectSchema = Schema;
