import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { UserOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './UserOrderByWithRelationAndSearchRelevanceInput.schema';
import { TagOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './TagOrderByWithRelationAndSearchRelevanceInput.schema';
import { FeedOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './FeedOrderByWithRelationAndSearchRelevanceInput.schema';
import { SmartListOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './SmartListOrderByWithRelationAndSearchRelevanceInput.schema';
import { FavoriteFolderOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './FavoriteFolderOrderByWithRelationAndSearchRelevanceInput.schema';
import { AnnotationOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './AnnotationOrderByWithRelationAndSearchRelevanceInput.schema';
import { BookmarkOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './BookmarkOrderByWithRelationAndSearchRelevanceInput.schema';
import { FavoriteOrderByRelevanceInputObjectSchema } from './FavoriteOrderByRelevanceInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FavoriteOrderByWithRelationAndSearchRelevanceInput> = z
	.object({
		id: z.lazy(() => SortOrderSchema).optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
		userId: z.lazy(() => SortOrderSchema).optional(),
		deleted: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		user: z.lazy(() => UserOrderByWithRelationAndSearchRelevanceInputObjectSchema).optional(),
		tagId: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		tag: z.lazy(() => TagOrderByWithRelationAndSearchRelevanceInputObjectSchema).optional(),
		rssId: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		rss: z.lazy(() => FeedOrderByWithRelationAndSearchRelevanceInputObjectSchema).optional(),
		smartListId: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		smartList: z
			.lazy(() => SmartListOrderByWithRelationAndSearchRelevanceInputObjectSchema)
			.optional(),
		folder: z
			.lazy(() => FavoriteFolderOrderByWithRelationAndSearchRelevanceInputObjectSchema)
			.optional(),
		favoriteFolderId: z
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
		_relevance: z.lazy(() => FavoriteOrderByRelevanceInputObjectSchema).optional(),
	})
	.strict();

export const FavoriteOrderByWithRelationAndSearchRelevanceInputObjectSchema = Schema;
