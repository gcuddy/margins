import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.BookmarkAvgOrderByAggregateInput> = z
	.object({
		id: z.lazy(() => SortOrderSchema).optional(),
		entryId: z.lazy(() => SortOrderSchema).optional(),
		sortOrder: z.lazy(() => SortOrderSchema).optional(),
		progress: z.lazy(() => SortOrderSchema).optional(),
		stateId: z.lazy(() => SortOrderSchema).optional(),
		interactionId: z.lazy(() => SortOrderSchema).optional(),
		favoriteId: z.lazy(() => SortOrderSchema).optional(),
	})
	.strict();

export const BookmarkAvgOrderByAggregateInputObjectSchema = Schema;
