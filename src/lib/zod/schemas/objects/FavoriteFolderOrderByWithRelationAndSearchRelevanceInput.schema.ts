import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { UserOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './UserOrderByWithRelationAndSearchRelevanceInput.schema';
import { FavoriteOrderByRelationAggregateInputObjectSchema } from './FavoriteOrderByRelationAggregateInput.schema';
import { FavoriteFolderOrderByRelevanceInputObjectSchema } from './FavoriteFolderOrderByRelevanceInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FavoriteFolderOrderByWithRelationAndSearchRelevanceInput> = z
	.object({
		id: z.lazy(() => SortOrderSchema).optional(),
		name: z.lazy(() => SortOrderSchema).optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
		userId: z.lazy(() => SortOrderSchema).optional(),
		user: z.lazy(() => UserOrderByWithRelationAndSearchRelevanceInputObjectSchema).optional(),
		favorites: z.lazy(() => FavoriteOrderByRelationAggregateInputObjectSchema).optional(),
		_relevance: z.lazy(() => FavoriteFolderOrderByRelevanceInputObjectSchema).optional(),
	})
	.strict();

export const FavoriteFolderOrderByWithRelationAndSearchRelevanceInputObjectSchema = Schema;
