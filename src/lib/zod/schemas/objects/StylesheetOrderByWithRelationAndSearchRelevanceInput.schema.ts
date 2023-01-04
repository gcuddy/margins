import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { UserEntryOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './UserEntryOrderByWithRelationAndSearchRelevanceInput.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { UserOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './UserOrderByWithRelationAndSearchRelevanceInput.schema';
import { StylesheetOrderByRelevanceInputObjectSchema } from './StylesheetOrderByRelevanceInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.StylesheetOrderByWithRelationAndSearchRelevanceInput> = z
	.object({
		id: z.lazy(() => SortOrderSchema).optional(),
		domain: z.lazy(() => SortOrderSchema).optional(),
		css: z.lazy(() => SortOrderSchema).optional(),
		entry: z.lazy(() => UserEntryOrderByWithRelationAndSearchRelevanceInputObjectSchema).optional(),
		userEntryId: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		user: z.lazy(() => UserOrderByWithRelationAndSearchRelevanceInputObjectSchema).optional(),
		userId: z.lazy(() => SortOrderSchema).optional(),
		_relevance: z.lazy(() => StylesheetOrderByRelevanceInputObjectSchema).optional(),
	})
	.strict();

export const StylesheetOrderByWithRelationAndSearchRelevanceInputObjectSchema = Schema;
