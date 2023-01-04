import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.AnnotationCountOrderByAggregateInput> = z
	.object({
		id: z.lazy(() => SortOrderSchema).optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
		body: z.lazy(() => SortOrderSchema).optional(),
		type: z.lazy(() => SortOrderSchema).optional(),
		private: z.lazy(() => SortOrderSchema).optional(),
		target: z.lazy(() => SortOrderSchema).optional(),
		entryId: z.lazy(() => SortOrderSchema).optional(),
		parentId: z.lazy(() => SortOrderSchema).optional(),
		deleted: z.lazy(() => SortOrderSchema).optional(),
		userId: z.lazy(() => SortOrderSchema).optional(),
		sortOrder: z.lazy(() => SortOrderSchema).optional(),
		bookmarkId: z.lazy(() => SortOrderSchema).optional(),
	})
	.strict();

export const AnnotationCountOrderByAggregateInputObjectSchema = Schema;
