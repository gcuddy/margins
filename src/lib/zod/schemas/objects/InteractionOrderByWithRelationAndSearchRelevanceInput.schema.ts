import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { EntryOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './EntryOrderByWithRelationAndSearchRelevanceInput.schema';
import { UserOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './UserOrderByWithRelationAndSearchRelevanceInput.schema';
import { BookmarkOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './BookmarkOrderByWithRelationAndSearchRelevanceInput.schema';
import { InteractionOrderByRelevanceInputObjectSchema } from './InteractionOrderByRelevanceInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.InteractionOrderByWithRelationAndSearchRelevanceInput> = z
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
		entry: z.lazy(() => EntryOrderByWithRelationAndSearchRelevanceInputObjectSchema).optional(),
		entryId: z.lazy(() => SortOrderSchema).optional(),
		userId: z.lazy(() => SortOrderSchema).optional(),
		user: z.lazy(() => UserOrderByWithRelationAndSearchRelevanceInputObjectSchema).optional(),
		bookmark: z
			.lazy(() => BookmarkOrderByWithRelationAndSearchRelevanceInputObjectSchema)
			.optional(),
		last_viewed: z.lazy(() => SortOrderSchema).optional(),
		last_annotated: z.lazy(() => SortOrderSchema).optional(),
		last_interaction: z.lazy(() => SortOrderSchema).optional(),
		_relevance: z.lazy(() => InteractionOrderByRelevanceInputObjectSchema).optional(),
	})
	.strict();

export const InteractionOrderByWithRelationAndSearchRelevanceInputObjectSchema = Schema;
