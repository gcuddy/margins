import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { FavoriteOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './FavoriteOrderByWithRelationAndSearchRelevanceInput.schema';
import { SmartListOrderByRelevanceInputObjectSchema } from './SmartListOrderByRelevanceInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.SmartListOrderByWithRelationAndSearchRelevanceInput> = z
	.object({
		id: z.lazy(() => SortOrderSchema).optional(),
		name: z.lazy(() => SortOrderSchema).optional(),
		filter: z.lazy(() => SortOrderSchema).optional(),
		viewOptions: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		favorite: z
			.lazy(() => FavoriteOrderByWithRelationAndSearchRelevanceInputObjectSchema)
			.optional(),
		_relevance: z.lazy(() => SmartListOrderByRelevanceInputObjectSchema).optional(),
	})
	.strict();

export const SmartListOrderByWithRelationAndSearchRelevanceInputObjectSchema = Schema;
