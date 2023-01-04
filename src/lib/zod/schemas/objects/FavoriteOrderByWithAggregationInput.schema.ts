import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { FavoriteCountOrderByAggregateInputObjectSchema } from './FavoriteCountOrderByAggregateInput.schema';
import { FavoriteAvgOrderByAggregateInputObjectSchema } from './FavoriteAvgOrderByAggregateInput.schema';
import { FavoriteMaxOrderByAggregateInputObjectSchema } from './FavoriteMaxOrderByAggregateInput.schema';
import { FavoriteMinOrderByAggregateInputObjectSchema } from './FavoriteMinOrderByAggregateInput.schema';
import { FavoriteSumOrderByAggregateInputObjectSchema } from './FavoriteSumOrderByAggregateInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FavoriteOrderByWithAggregationInput> = z
	.object({
		id: z.lazy(() => SortOrderSchema).optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
		userId: z.lazy(() => SortOrderSchema).optional(),
		deleted: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		tagId: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		rssId: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		smartListId: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		favoriteFolderId: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		annotationId: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		bookmarkId: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		_count: z.lazy(() => FavoriteCountOrderByAggregateInputObjectSchema).optional(),
		_avg: z.lazy(() => FavoriteAvgOrderByAggregateInputObjectSchema).optional(),
		_max: z.lazy(() => FavoriteMaxOrderByAggregateInputObjectSchema).optional(),
		_min: z.lazy(() => FavoriteMinOrderByAggregateInputObjectSchema).optional(),
		_sum: z.lazy(() => FavoriteSumOrderByAggregateInputObjectSchema).optional(),
	})
	.strict();

export const FavoriteOrderByWithAggregationInputObjectSchema = Schema;
