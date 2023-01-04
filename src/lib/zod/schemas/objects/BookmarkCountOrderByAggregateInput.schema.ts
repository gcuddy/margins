import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.BookmarkCountOrderByAggregateInput> = z
	.object({
		id: z.lazy(() => SortOrderSchema).optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
		context: z.lazy(() => SortOrderSchema).optional(),
		uri: z.lazy(() => SortOrderSchema).optional(),
		entryId: z.lazy(() => SortOrderSchema).optional(),
		userId: z.lazy(() => SortOrderSchema).optional(),
		sortOrder: z.lazy(() => SortOrderSchema).optional(),
		is_read: z.lazy(() => SortOrderSchema).optional(),
		progress: z.lazy(() => SortOrderSchema).optional(),
		data: z.lazy(() => SortOrderSchema).optional(),
		stateId: z.lazy(() => SortOrderSchema).optional(),
		private: z.lazy(() => SortOrderSchema).optional(),
		interactionId: z.lazy(() => SortOrderSchema).optional(),
		favoriteId: z.lazy(() => SortOrderSchema).optional(),
		deleted: z.lazy(() => SortOrderSchema).optional(),
	})
	.strict();

export const BookmarkCountOrderByAggregateInputObjectSchema = Schema;
