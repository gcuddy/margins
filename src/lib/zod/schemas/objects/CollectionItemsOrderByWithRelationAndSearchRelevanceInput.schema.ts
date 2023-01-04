import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { CollectionOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './CollectionOrderByWithRelationAndSearchRelevanceInput.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { AnnotationOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './AnnotationOrderByWithRelationAndSearchRelevanceInput.schema';
import { BookmarkOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './BookmarkOrderByWithRelationAndSearchRelevanceInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.CollectionItemsOrderByWithRelationAndSearchRelevanceInput> = z
	.object({
		id: z.lazy(() => SortOrderSchema).optional(),
		collection: z
			.lazy(() => CollectionOrderByWithRelationAndSearchRelevanceInputObjectSchema)
			.optional(),
		collectionId: z.lazy(() => SortOrderSchema).optional(),
		position: z.lazy(() => SortOrderSchema).optional(),
		type: z.lazy(() => SortOrderSchema).optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
		annotationId: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		annotation: z
			.lazy(() => AnnotationOrderByWithRelationAndSearchRelevanceInputObjectSchema)
			.optional(),
		bookmark: z
			.lazy(() => BookmarkOrderByWithRelationAndSearchRelevanceInputObjectSchema)
			.optional(),
		bookmarkId: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
	})
	.strict();

export const CollectionItemsOrderByWithRelationAndSearchRelevanceInputObjectSchema = Schema;
