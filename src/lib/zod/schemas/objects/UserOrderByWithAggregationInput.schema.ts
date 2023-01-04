import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { UserCountOrderByAggregateInputObjectSchema } from './UserCountOrderByAggregateInput.schema';
import { UserAvgOrderByAggregateInputObjectSchema } from './UserAvgOrderByAggregateInput.schema';
import { UserMaxOrderByAggregateInputObjectSchema } from './UserMaxOrderByAggregateInput.schema';
import { UserMinOrderByAggregateInputObjectSchema } from './UserMinOrderByAggregateInput.schema';
import { UserSumOrderByAggregateInputObjectSchema } from './UserSumOrderByAggregateInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserOrderByWithAggregationInput> = z
	.object({
		id: z.lazy(() => SortOrderSchema).optional(),
		provider_id: z.lazy(() => SortOrderSchema).optional(),
		hashed_password: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
		email: z.lazy(() => SortOrderSchema).optional(),
		username: z.lazy(() => SortOrderSchema).optional(),
		default_state_id: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		_count: z.lazy(() => UserCountOrderByAggregateInputObjectSchema).optional(),
		_avg: z.lazy(() => UserAvgOrderByAggregateInputObjectSchema).optional(),
		_max: z.lazy(() => UserMaxOrderByAggregateInputObjectSchema).optional(),
		_min: z.lazy(() => UserMinOrderByAggregateInputObjectSchema).optional(),
		_sum: z.lazy(() => UserSumOrderByAggregateInputObjectSchema).optional(),
	})
	.strict();

export const UserOrderByWithAggregationInputObjectSchema = Schema;
