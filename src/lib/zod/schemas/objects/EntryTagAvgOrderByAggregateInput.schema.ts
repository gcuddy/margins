import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryTagAvgOrderByAggregateInput> = z
	.object({
		tagId: z.lazy(() => SortOrderSchema).optional(),
		entryId: z.lazy(() => SortOrderSchema).optional(),
	})
	.strict();

export const EntryTagAvgOrderByAggregateInputObjectSchema = Schema;
