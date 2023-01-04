import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserMaxOrderByAggregateInput> = z
	.object({
		id: z.lazy(() => SortOrderSchema).optional(),
		provider_id: z.lazy(() => SortOrderSchema).optional(),
		hashed_password: z.lazy(() => SortOrderSchema).optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
		email: z.lazy(() => SortOrderSchema).optional(),
		username: z.lazy(() => SortOrderSchema).optional(),
		default_state_id: z.lazy(() => SortOrderSchema).optional(),
	})
	.strict();

export const UserMaxOrderByAggregateInputObjectSchema = Schema;
