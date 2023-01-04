import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { ContextNodeCountOrderByAggregateInputObjectSchema } from './ContextNodeCountOrderByAggregateInput.schema';
import { ContextNodeMaxOrderByAggregateInputObjectSchema } from './ContextNodeMaxOrderByAggregateInput.schema';
import { ContextNodeMinOrderByAggregateInputObjectSchema } from './ContextNodeMinOrderByAggregateInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ContextNodeOrderByWithAggregationInput> = z
	.object({
		id: z.lazy(() => SortOrderSchema).optional(),
		name: z.lazy(() => SortOrderSchema).optional(),
		url: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		description: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		userId: z.lazy(() => SortOrderSchema).optional(),
		refers_to: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		_count: z.lazy(() => ContextNodeCountOrderByAggregateInputObjectSchema).optional(),
		_max: z.lazy(() => ContextNodeMaxOrderByAggregateInputObjectSchema).optional(),
		_min: z.lazy(() => ContextNodeMinOrderByAggregateInputObjectSchema).optional(),
	})
	.strict();

export const ContextNodeOrderByWithAggregationInputObjectSchema = Schema;
