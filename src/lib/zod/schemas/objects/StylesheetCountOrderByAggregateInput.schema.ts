import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.StylesheetCountOrderByAggregateInput> = z
	.object({
		id: z.lazy(() => SortOrderSchema).optional(),
		domain: z.lazy(() => SortOrderSchema).optional(),
		css: z.lazy(() => SortOrderSchema).optional(),
		userEntryId: z.lazy(() => SortOrderSchema).optional(),
		userId: z.lazy(() => SortOrderSchema).optional(),
	})
	.strict();

export const StylesheetCountOrderByAggregateInputObjectSchema = Schema;
