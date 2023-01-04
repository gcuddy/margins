import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ContextCountOrderByAggregateInput> = z
	.object({
		id: z.lazy(() => SortOrderSchema).optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		userId: z.lazy(() => SortOrderSchema).optional(),
		entryId: z.lazy(() => SortOrderSchema).optional(),
		feedId: z.lazy(() => SortOrderSchema).optional(),
		url: z.lazy(() => SortOrderSchema).optional(),
		description: z.lazy(() => SortOrderSchema).optional(),
	})
	.strict();

export const ContextCountOrderByAggregateInputObjectSchema = Schema;
