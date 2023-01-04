import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { UserOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './UserOrderByWithRelationAndSearchRelevanceInput.schema';
import { CollectionItemsOrderByRelationAggregateInputObjectSchema } from './CollectionItemsOrderByRelationAggregateInput.schema';
import { CollectionOrderByRelevanceInputObjectSchema } from './CollectionOrderByRelevanceInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.CollectionOrderByWithRelationAndSearchRelevanceInput> = z
	.object({
		id: z.lazy(() => SortOrderSchema).optional(),
		name: z.lazy(() => SortOrderSchema).optional(),
		private: z.lazy(() => SortOrderSchema).optional(),
		icon: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		user: z.lazy(() => UserOrderByWithRelationAndSearchRelevanceInputObjectSchema).optional(),
		userId: z.lazy(() => SortOrderSchema).optional(),
		description: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
		items: z.lazy(() => CollectionItemsOrderByRelationAggregateInputObjectSchema).optional(),
		_relevance: z.lazy(() => CollectionOrderByRelevanceInputObjectSchema).optional(),
	})
	.strict();

export const CollectionOrderByWithRelationAndSearchRelevanceInputObjectSchema = Schema;
