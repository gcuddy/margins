import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { StylesheetOrderByRelationAggregateInputObjectSchema } from './StylesheetOrderByRelationAggregateInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserEntryOrderByWithRelationAndSearchRelevanceInput> = z
	.object({
		id: z.lazy(() => SortOrderSchema).optional(),
		Stylesheet: z.lazy(() => StylesheetOrderByRelationAggregateInputObjectSchema).optional(),
	})
	.strict();

export const UserEntryOrderByWithRelationAndSearchRelevanceInputObjectSchema = Schema;
