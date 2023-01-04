import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ArticleAvgOrderByAggregateInput> = z
	.object({
		id: z.lazy(() => SortOrderSchema).optional(),
		readProgress: z.lazy(() => SortOrderSchema).optional(),
		wordCount: z.lazy(() => SortOrderSchema).optional(),
		position: z.lazy(() => SortOrderSchema).optional(),
		type: z.lazy(() => SortOrderSchema).optional(),
		favoriteId: z.lazy(() => SortOrderSchema).optional(),
	})
	.strict();

export const ArticleAvgOrderByAggregateInputObjectSchema = Schema;
