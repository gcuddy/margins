import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.InteractionCountOrderByAggregateInput> = z
	.object({
		id: z.lazy(() => SortOrderSchema).optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
		is_read: z.lazy(() => SortOrderSchema).optional(),
		progress: z.lazy(() => SortOrderSchema).optional(),
		finished: z.lazy(() => SortOrderSchema).optional(),
		entryId: z.lazy(() => SortOrderSchema).optional(),
		userId: z.lazy(() => SortOrderSchema).optional(),
		last_viewed: z.lazy(() => SortOrderSchema).optional(),
		last_annotated: z.lazy(() => SortOrderSchema).optional(),
		last_interaction: z.lazy(() => SortOrderSchema).optional(),
	})
	.strict();

export const InteractionCountOrderByAggregateInputObjectSchema = Schema;
