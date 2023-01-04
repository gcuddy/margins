import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.SessionMaxOrderByAggregateInput> = z
	.object({
		id: z.lazy(() => SortOrderSchema).optional(),
		user_id: z.lazy(() => SortOrderSchema).optional(),
		expires: z.lazy(() => SortOrderSchema).optional(),
		idle_expires: z.lazy(() => SortOrderSchema).optional(),
	})
	.strict();

export const SessionMaxOrderByAggregateInputObjectSchema = Schema;
