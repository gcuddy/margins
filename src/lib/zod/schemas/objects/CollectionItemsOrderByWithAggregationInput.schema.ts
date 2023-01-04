import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { CollectionItemsCountOrderByAggregateInputObjectSchema } from './CollectionItemsCountOrderByAggregateInput.schema';
import { CollectionItemsAvgOrderByAggregateInputObjectSchema } from './CollectionItemsAvgOrderByAggregateInput.schema';
import { CollectionItemsMaxOrderByAggregateInputObjectSchema } from './CollectionItemsMaxOrderByAggregateInput.schema';
import { CollectionItemsMinOrderByAggregateInputObjectSchema } from './CollectionItemsMinOrderByAggregateInput.schema';
import { CollectionItemsSumOrderByAggregateInputObjectSchema } from './CollectionItemsSumOrderByAggregateInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.CollectionItemsOrderByWithAggregationInput> = z
	.object({
		id: z.lazy(() => SortOrderSchema).optional(),
		collectionId: z.lazy(() => SortOrderSchema).optional(),
		position: z.lazy(() => SortOrderSchema).optional(),
		type: z.lazy(() => SortOrderSchema).optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
		annotationId: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		bookmarkId: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		_count: z.lazy(() => CollectionItemsCountOrderByAggregateInputObjectSchema).optional(),
		_avg: z.lazy(() => CollectionItemsAvgOrderByAggregateInputObjectSchema).optional(),
		_max: z.lazy(() => CollectionItemsMaxOrderByAggregateInputObjectSchema).optional(),
		_min: z.lazy(() => CollectionItemsMinOrderByAggregateInputObjectSchema).optional(),
		_sum: z.lazy(() => CollectionItemsSumOrderByAggregateInputObjectSchema).optional(),
	})
	.strict();

export const CollectionItemsOrderByWithAggregationInputObjectSchema = Schema;
