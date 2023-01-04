import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { StateCountOrderByAggregateInputObjectSchema } from './StateCountOrderByAggregateInput.schema';
import { StateAvgOrderByAggregateInputObjectSchema } from './StateAvgOrderByAggregateInput.schema';
import { StateMaxOrderByAggregateInputObjectSchema } from './StateMaxOrderByAggregateInput.schema';
import { StateMinOrderByAggregateInputObjectSchema } from './StateMinOrderByAggregateInput.schema';
import { StateSumOrderByAggregateInputObjectSchema } from './StateSumOrderByAggregateInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.StateOrderByWithAggregationInput> = z
	.object({
		id: z.lazy(() => SortOrderSchema).optional(),
		read_later: z.lazy(() => SortOrderSchema).optional(),
		name: z.lazy(() => SortOrderSchema).optional(),
		color: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		type: z.lazy(() => SortOrderSchema).optional(),
		position: z.lazy(() => SortOrderSchema).optional(),
		description: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		userId: z.lazy(() => SortOrderSchema).optional(),
		default: z.lazy(() => SortOrderSchema).optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
		_count: z.lazy(() => StateCountOrderByAggregateInputObjectSchema).optional(),
		_avg: z.lazy(() => StateAvgOrderByAggregateInputObjectSchema).optional(),
		_max: z.lazy(() => StateMaxOrderByAggregateInputObjectSchema).optional(),
		_min: z.lazy(() => StateMinOrderByAggregateInputObjectSchema).optional(),
		_sum: z.lazy(() => StateSumOrderByAggregateInputObjectSchema).optional(),
	})
	.strict();

export const StateOrderByWithAggregationInputObjectSchema = Schema;
