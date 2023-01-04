import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.InteractionAvgOrderByAggregateInput> = z
	.object({
		id: z.lazy(() => SortOrderSchema).optional(),
		progress: z.lazy(() => SortOrderSchema).optional(),
		entryId: z.lazy(() => SortOrderSchema).optional(),
	})
	.strict();

export const InteractionAvgOrderByAggregateInputObjectSchema = Schema;
