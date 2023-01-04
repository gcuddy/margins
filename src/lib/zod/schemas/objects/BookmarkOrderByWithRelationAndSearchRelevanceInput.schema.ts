import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { EntryOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './EntryOrderByWithRelationAndSearchRelevanceInput.schema';
import { UserOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './UserOrderByWithRelationAndSearchRelevanceInput.schema';
import { StateOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './StateOrderByWithRelationAndSearchRelevanceInput.schema';
import { TaggingOrderByRelationAggregateInputObjectSchema } from './TaggingOrderByRelationAggregateInput.schema';
import { CollectionItemsOrderByRelationAggregateInputObjectSchema } from './CollectionItemsOrderByRelationAggregateInput.schema';
import { InteractionOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './InteractionOrderByWithRelationAndSearchRelevanceInput.schema';
import { FavoriteOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './FavoriteOrderByWithRelationAndSearchRelevanceInput.schema';
import { AnnotationOrderByRelationAggregateInputObjectSchema } from './AnnotationOrderByRelationAggregateInput.schema';
import { BookmarkOrderByRelevanceInputObjectSchema } from './BookmarkOrderByRelevanceInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.BookmarkOrderByWithRelationAndSearchRelevanceInput> = z
	.object({
		id: z.lazy(() => SortOrderSchema).optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
		context: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		entry: z.lazy(() => EntryOrderByWithRelationAndSearchRelevanceInputObjectSchema).optional(),
		uri: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		entryId: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		user: z.lazy(() => UserOrderByWithRelationAndSearchRelevanceInputObjectSchema).optional(),
		userId: z.lazy(() => SortOrderSchema).optional(),
		sortOrder: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		is_read: z.lazy(() => SortOrderSchema).optional(),
		progress: z.lazy(() => SortOrderSchema).optional(),
		data: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		state: z.lazy(() => StateOrderByWithRelationAndSearchRelevanceInputObjectSchema).optional(),
		stateId: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		private: z.lazy(() => SortOrderSchema).optional(),
		tags: z.lazy(() => TaggingOrderByRelationAggregateInputObjectSchema).optional(),
		collections: z.lazy(() => CollectionItemsOrderByRelationAggregateInputObjectSchema).optional(),
		interaction: z
			.lazy(() => InteractionOrderByWithRelationAndSearchRelevanceInputObjectSchema)
			.optional(),
		interactionId: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		favorite: z
			.lazy(() => FavoriteOrderByWithRelationAndSearchRelevanceInputObjectSchema)
			.optional(),
		favoriteId: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		annotations: z.lazy(() => AnnotationOrderByRelationAggregateInputObjectSchema).optional(),
		deleted: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		_relevance: z.lazy(() => BookmarkOrderByRelevanceInputObjectSchema).optional(),
	})
	.strict();

export const BookmarkOrderByWithRelationAndSearchRelevanceInputObjectSchema = Schema;
