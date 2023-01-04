import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { FeedCountOrderByAggregateInputObjectSchema } from './FeedCountOrderByAggregateInput.schema';
import { FeedAvgOrderByAggregateInputObjectSchema } from './FeedAvgOrderByAggregateInput.schema';
import { FeedMaxOrderByAggregateInputObjectSchema } from './FeedMaxOrderByAggregateInput.schema';
import { FeedMinOrderByAggregateInputObjectSchema } from './FeedMinOrderByAggregateInput.schema';
import { FeedSumOrderByAggregateInputObjectSchema } from './FeedSumOrderByAggregateInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FeedOrderByWithAggregationInput> = z
	.object({
		id: z.lazy(() => SortOrderSchema).optional(),
		itunes_id: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		feedUrl: z.lazy(() => SortOrderSchema).optional(),
		title: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		link: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		creator: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		description: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		lastBuildDate: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		imageUrl: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		podcast: z.lazy(() => SortOrderSchema).optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
		active: z.lazy(() => SortOrderSchema).optional(),
		velocity: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		_count: z.lazy(() => FeedCountOrderByAggregateInputObjectSchema).optional(),
		_avg: z.lazy(() => FeedAvgOrderByAggregateInputObjectSchema).optional(),
		_max: z.lazy(() => FeedMaxOrderByAggregateInputObjectSchema).optional(),
		_min: z.lazy(() => FeedMinOrderByAggregateInputObjectSchema).optional(),
		_sum: z.lazy(() => FeedSumOrderByAggregateInputObjectSchema).optional(),
	})
	.strict();

export const FeedOrderByWithAggregationInputObjectSchema = Schema;
