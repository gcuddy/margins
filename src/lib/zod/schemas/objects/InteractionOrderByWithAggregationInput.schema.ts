import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { InteractionCountOrderByAggregateInputObjectSchema } from './InteractionCountOrderByAggregateInput.schema';
import { InteractionAvgOrderByAggregateInputObjectSchema } from './InteractionAvgOrderByAggregateInput.schema';
import { InteractionMaxOrderByAggregateInputObjectSchema } from './InteractionMaxOrderByAggregateInput.schema';
import { InteractionMinOrderByAggregateInputObjectSchema } from './InteractionMinOrderByAggregateInput.schema';
import { InteractionSumOrderByAggregateInputObjectSchema } from './InteractionSumOrderByAggregateInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.InteractionOrderByWithAggregationInput> = z
	.object({
		id: z.lazy(() => SortOrderSchema).optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
		is_read: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		progress: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		finished: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		entryId: z.lazy(() => SortOrderSchema).optional(),
		userId: z.lazy(() => SortOrderSchema).optional(),
		last_viewed: z.lazy(() => SortOrderSchema).optional(),
		last_annotated: z.lazy(() => SortOrderSchema).optional(),
		last_interaction: z.lazy(() => SortOrderSchema).optional(),
		_count: z.lazy(() => InteractionCountOrderByAggregateInputObjectSchema).optional(),
		_avg: z.lazy(() => InteractionAvgOrderByAggregateInputObjectSchema).optional(),
		_max: z.lazy(() => InteractionMaxOrderByAggregateInputObjectSchema).optional(),
		_min: z.lazy(() => InteractionMinOrderByAggregateInputObjectSchema).optional(),
		_sum: z.lazy(() => InteractionSumOrderByAggregateInputObjectSchema).optional(),
	})
	.strict();

export const InteractionOrderByWithAggregationInputObjectSchema = Schema;
