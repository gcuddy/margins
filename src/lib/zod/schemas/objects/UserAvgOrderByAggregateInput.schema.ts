import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserAvgOrderByAggregateInput> = z
	.object({
		default_state_id: z.lazy(() => SortOrderSchema).optional(),
	})
	.strict();

export const UserAvgOrderByAggregateInputObjectSchema = Schema;
