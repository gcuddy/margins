import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.AnnotationSumOrderByAggregateInput> = z
	.object({
		id: z.lazy(() => SortOrderSchema).optional(),
		entryId: z.lazy(() => SortOrderSchema).optional(),
		parentId: z.lazy(() => SortOrderSchema).optional(),
		sortOrder: z.lazy(() => SortOrderSchema).optional(),
		bookmarkId: z.lazy(() => SortOrderSchema).optional(),
	})
	.strict();

export const AnnotationSumOrderByAggregateInputObjectSchema = Schema;
