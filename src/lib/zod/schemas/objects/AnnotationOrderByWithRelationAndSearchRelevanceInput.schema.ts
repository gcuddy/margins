import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { TaggingOrderByRelationAggregateInputObjectSchema } from './TaggingOrderByRelationAggregateInput.schema';
import { EntryOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './EntryOrderByWithRelationAndSearchRelevanceInput.schema';
import { AnnotationOrderByRelationAggregateInputObjectSchema } from './AnnotationOrderByRelationAggregateInput.schema';
import { UserOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './UserOrderByWithRelationAndSearchRelevanceInput.schema';
import { CollectionItemsOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './CollectionItemsOrderByWithRelationAndSearchRelevanceInput.schema';
import { FavoriteOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './FavoriteOrderByWithRelationAndSearchRelevanceInput.schema';
import { BookmarkOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './BookmarkOrderByWithRelationAndSearchRelevanceInput.schema';
import { AnnotationOrderByRelevanceInputObjectSchema } from './AnnotationOrderByRelevanceInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.AnnotationOrderByWithRelationAndSearchRelevanceInput> = z
	.object({
		id: z.lazy(() => SortOrderSchema).optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
		body: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		tags: z.lazy(() => TaggingOrderByRelationAggregateInputObjectSchema).optional(),
		type: z.lazy(() => SortOrderSchema).optional(),
		private: z.lazy(() => SortOrderSchema).optional(),
		target: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		entry: z.lazy(() => EntryOrderByWithRelationAndSearchRelevanceInputObjectSchema).optional(),
		entryId: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		parent: z
			.lazy(() => AnnotationOrderByWithRelationAndSearchRelevanceInputObjectSchema)
			.optional(),
		parentId: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		children: z.lazy(() => AnnotationOrderByRelationAggregateInputObjectSchema).optional(),
		deleted: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		creator: z.lazy(() => UserOrderByWithRelationAndSearchRelevanceInputObjectSchema).optional(),
		userId: z.lazy(() => SortOrderSchema).optional(),
		sortOrder: z.lazy(() => SortOrderSchema).optional(),
		collections: z
			.lazy(() => CollectionItemsOrderByWithRelationAndSearchRelevanceInputObjectSchema)
			.optional(),
		favorite: z
			.lazy(() => FavoriteOrderByWithRelationAndSearchRelevanceInputObjectSchema)
			.optional(),
		bookmark: z
			.lazy(() => BookmarkOrderByWithRelationAndSearchRelevanceInputObjectSchema)
			.optional(),
		bookmarkId: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		_relevance: z.lazy(() => AnnotationOrderByRelevanceInputObjectSchema).optional(),
	})
	.strict();

export const AnnotationOrderByWithRelationAndSearchRelevanceInputObjectSchema = Schema;
