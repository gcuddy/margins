import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryMediaAvgOrderByAggregateInput> = z
	.object({
		id: z.lazy(() => SortOrderSchema).optional(),
		size: z.lazy(() => SortOrderSchema).optional(),
		duration: z.lazy(() => SortOrderSchema).optional(),
		documentDataId: z.lazy(() => SortOrderSchema).optional(),
		entryId: z.lazy(() => SortOrderSchema).optional(),
	})
	.strict();

export const EntryMediaAvgOrderByAggregateInputObjectSchema = Schema;
