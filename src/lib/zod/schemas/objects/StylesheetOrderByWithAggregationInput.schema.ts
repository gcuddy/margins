import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { StylesheetCountOrderByAggregateInputObjectSchema } from './StylesheetCountOrderByAggregateInput.schema';
import { StylesheetAvgOrderByAggregateInputObjectSchema } from './StylesheetAvgOrderByAggregateInput.schema';
import { StylesheetMaxOrderByAggregateInputObjectSchema } from './StylesheetMaxOrderByAggregateInput.schema';
import { StylesheetMinOrderByAggregateInputObjectSchema } from './StylesheetMinOrderByAggregateInput.schema';
import { StylesheetSumOrderByAggregateInputObjectSchema } from './StylesheetSumOrderByAggregateInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.StylesheetOrderByWithAggregationInput> = z
	.object({
		id: z.lazy(() => SortOrderSchema).optional(),
		domain: z.lazy(() => SortOrderSchema).optional(),
		css: z.lazy(() => SortOrderSchema).optional(),
		userEntryId: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		userId: z.lazy(() => SortOrderSchema).optional(),
		_count: z.lazy(() => StylesheetCountOrderByAggregateInputObjectSchema).optional(),
		_avg: z.lazy(() => StylesheetAvgOrderByAggregateInputObjectSchema).optional(),
		_max: z.lazy(() => StylesheetMaxOrderByAggregateInputObjectSchema).optional(),
		_min: z.lazy(() => StylesheetMinOrderByAggregateInputObjectSchema).optional(),
		_sum: z.lazy(() => StylesheetSumOrderByAggregateInputObjectSchema).optional(),
	})
	.strict();

export const StylesheetOrderByWithAggregationInputObjectSchema = Schema;
