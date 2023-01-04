import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { SmartListCountOrderByAggregateInputObjectSchema } from './SmartListCountOrderByAggregateInput.schema';
import { SmartListAvgOrderByAggregateInputObjectSchema } from './SmartListAvgOrderByAggregateInput.schema';
import { SmartListMaxOrderByAggregateInputObjectSchema } from './SmartListMaxOrderByAggregateInput.schema';
import { SmartListMinOrderByAggregateInputObjectSchema } from './SmartListMinOrderByAggregateInput.schema';
import { SmartListSumOrderByAggregateInputObjectSchema } from './SmartListSumOrderByAggregateInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.SmartListOrderByWithAggregationInput> = z
	.object({
		id: z.lazy(() => SortOrderSchema).optional(),
		name: z.lazy(() => SortOrderSchema).optional(),
		filter: z.lazy(() => SortOrderSchema).optional(),
		viewOptions: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		_count: z.lazy(() => SmartListCountOrderByAggregateInputObjectSchema).optional(),
		_avg: z.lazy(() => SmartListAvgOrderByAggregateInputObjectSchema).optional(),
		_max: z.lazy(() => SmartListMaxOrderByAggregateInputObjectSchema).optional(),
		_min: z.lazy(() => SmartListMinOrderByAggregateInputObjectSchema).optional(),
		_sum: z.lazy(() => SmartListSumOrderByAggregateInputObjectSchema).optional(),
	})
	.strict();

export const SmartListOrderByWithAggregationInputObjectSchema = Schema;
