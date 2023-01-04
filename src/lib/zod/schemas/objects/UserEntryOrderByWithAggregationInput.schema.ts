import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { UserEntryCountOrderByAggregateInputObjectSchema } from './UserEntryCountOrderByAggregateInput.schema';
import { UserEntryAvgOrderByAggregateInputObjectSchema } from './UserEntryAvgOrderByAggregateInput.schema';
import { UserEntryMaxOrderByAggregateInputObjectSchema } from './UserEntryMaxOrderByAggregateInput.schema';
import { UserEntryMinOrderByAggregateInputObjectSchema } from './UserEntryMinOrderByAggregateInput.schema';
import { UserEntrySumOrderByAggregateInputObjectSchema } from './UserEntrySumOrderByAggregateInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserEntryOrderByWithAggregationInput> = z
	.object({
		id: z.lazy(() => SortOrderSchema).optional(),
		_count: z.lazy(() => UserEntryCountOrderByAggregateInputObjectSchema).optional(),
		_avg: z.lazy(() => UserEntryAvgOrderByAggregateInputObjectSchema).optional(),
		_max: z.lazy(() => UserEntryMaxOrderByAggregateInputObjectSchema).optional(),
		_min: z.lazy(() => UserEntryMinOrderByAggregateInputObjectSchema).optional(),
		_sum: z.lazy(() => UserEntrySumOrderByAggregateInputObjectSchema).optional(),
	})
	.strict();

export const UserEntryOrderByWithAggregationInputObjectSchema = Schema;
