import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.SmartListCountOrderByAggregateInput> = z
	.object({
		id: z.lazy(() => SortOrderSchema).optional(),
		name: z.lazy(() => SortOrderSchema).optional(),
		filter: z.lazy(() => SortOrderSchema).optional(),
		viewOptions: z.lazy(() => SortOrderSchema).optional(),
	})
	.strict();

export const SmartListCountOrderByAggregateInputObjectSchema = Schema;
