import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { FavoriteFolderCountOrderByAggregateInputObjectSchema } from './FavoriteFolderCountOrderByAggregateInput.schema';
import { FavoriteFolderAvgOrderByAggregateInputObjectSchema } from './FavoriteFolderAvgOrderByAggregateInput.schema';
import { FavoriteFolderMaxOrderByAggregateInputObjectSchema } from './FavoriteFolderMaxOrderByAggregateInput.schema';
import { FavoriteFolderMinOrderByAggregateInputObjectSchema } from './FavoriteFolderMinOrderByAggregateInput.schema';
import { FavoriteFolderSumOrderByAggregateInputObjectSchema } from './FavoriteFolderSumOrderByAggregateInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FavoriteFolderOrderByWithAggregationInput> = z
	.object({
		id: z.lazy(() => SortOrderSchema).optional(),
		name: z.lazy(() => SortOrderSchema).optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
		userId: z.lazy(() => SortOrderSchema).optional(),
		_count: z.lazy(() => FavoriteFolderCountOrderByAggregateInputObjectSchema).optional(),
		_avg: z.lazy(() => FavoriteFolderAvgOrderByAggregateInputObjectSchema).optional(),
		_max: z.lazy(() => FavoriteFolderMaxOrderByAggregateInputObjectSchema).optional(),
		_min: z.lazy(() => FavoriteFolderMinOrderByAggregateInputObjectSchema).optional(),
		_sum: z.lazy(() => FavoriteFolderSumOrderByAggregateInputObjectSchema).optional(),
	})
	.strict();

export const FavoriteFolderOrderByWithAggregationInputObjectSchema = Schema;
