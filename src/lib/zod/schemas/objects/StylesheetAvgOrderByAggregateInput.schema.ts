import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.StylesheetAvgOrderByAggregateInput> = z
	.object({
		id: z.lazy(() => SortOrderSchema).optional(),
		userEntryId: z.lazy(() => SortOrderSchema).optional(),
	})
	.strict();

export const StylesheetAvgOrderByAggregateInputObjectSchema = Schema;
