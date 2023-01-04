import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryMediaCountOrderByAggregateInput> = z
	.object({
		id: z.lazy(() => SortOrderSchema).optional(),
		url: z.lazy(() => SortOrderSchema).optional(),
		size: z.lazy(() => SortOrderSchema).optional(),
		duration: z.lazy(() => SortOrderSchema).optional(),
		type: z.lazy(() => SortOrderSchema).optional(),
		title: z.lazy(() => SortOrderSchema).optional(),
		documentDataId: z.lazy(() => SortOrderSchema).optional(),
		entryId: z.lazy(() => SortOrderSchema).optional(),
	})
	.strict();

export const EntryMediaCountOrderByAggregateInputObjectSchema = Schema;
