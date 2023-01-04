import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FavoriteAvgOrderByAggregateInput> = z
	.object({
		id: z.lazy(() => SortOrderSchema).optional(),
		tagId: z.lazy(() => SortOrderSchema).optional(),
		rssId: z.lazy(() => SortOrderSchema).optional(),
		smartListId: z.lazy(() => SortOrderSchema).optional(),
		favoriteFolderId: z.lazy(() => SortOrderSchema).optional(),
		annotationId: z.lazy(() => SortOrderSchema).optional(),
		bookmarkId: z.lazy(() => SortOrderSchema).optional(),
	})
	.strict();

export const FavoriteAvgOrderByAggregateInputObjectSchema = Schema;
