import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { TagOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './TagOrderByWithRelationAndSearchRelevanceInput.schema';
import { UserOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './UserOrderByWithRelationAndSearchRelevanceInput.schema';
import { FeedOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './FeedOrderByWithRelationAndSearchRelevanceInput.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { AnnotationOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './AnnotationOrderByWithRelationAndSearchRelevanceInput.schema';
import { BookmarkOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './BookmarkOrderByWithRelationAndSearchRelevanceInput.schema';
import { TaggingOrderByRelevanceInputObjectSchema } from './TaggingOrderByRelevanceInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.TaggingOrderByWithRelationAndSearchRelevanceInput> = z
	.object({
		id: z.lazy(() => SortOrderSchema).optional(),
		tag: z.lazy(() => TagOrderByWithRelationAndSearchRelevanceInputObjectSchema).optional(),
		tagId: z.lazy(() => SortOrderSchema).optional(),
		user: z.lazy(() => UserOrderByWithRelationAndSearchRelevanceInputObjectSchema).optional(),
		userId: z.lazy(() => SortOrderSchema).optional(),
		feed: z.lazy(() => FeedOrderByWithRelationAndSearchRelevanceInputObjectSchema).optional(),
		feedId: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		annotation: z
			.lazy(() => AnnotationOrderByWithRelationAndSearchRelevanceInputObjectSchema)
			.optional(),
		annotationId: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		bookmark: z
			.lazy(() => BookmarkOrderByWithRelationAndSearchRelevanceInputObjectSchema)
			.optional(),
		bookmarkId: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		_relevance: z.lazy(() => TaggingOrderByRelevanceInputObjectSchema).optional(),
	})
	.strict();

export const TaggingOrderByWithRelationAndSearchRelevanceInputObjectSchema = Schema;
