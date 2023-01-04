import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { SessionOrderByRelationAggregateInputObjectSchema } from './SessionOrderByRelationAggregateInput.schema';
import { UserOrderByRelationAggregateInputObjectSchema } from './UserOrderByRelationAggregateInput.schema';
import { InteractionOrderByRelationAggregateInputObjectSchema } from './InteractionOrderByRelationAggregateInput.schema';
import { FavoriteOrderByRelationAggregateInputObjectSchema } from './FavoriteOrderByRelationAggregateInput.schema';
import { ArticleOrderByRelationAggregateInputObjectSchema } from './ArticleOrderByRelationAggregateInput.schema';
import { FavoriteFolderOrderByRelationAggregateInputObjectSchema } from './FavoriteFolderOrderByRelationAggregateInput.schema';
import { CollectionOrderByRelationAggregateInputObjectSchema } from './CollectionOrderByRelationAggregateInput.schema';
import { AnnotationOrderByRelationAggregateInputObjectSchema } from './AnnotationOrderByRelationAggregateInput.schema';
import { SubscriptionOrderByRelationAggregateInputObjectSchema } from './SubscriptionOrderByRelationAggregateInput.schema';
import { EntryDataOrderByRelationAggregateInputObjectSchema } from './EntryDataOrderByRelationAggregateInput.schema';
import { StylesheetOrderByRelationAggregateInputObjectSchema } from './StylesheetOrderByRelationAggregateInput.schema';
import { StateOrderByRelationAggregateInputObjectSchema } from './StateOrderByRelationAggregateInput.schema';
import { StateOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './StateOrderByWithRelationAndSearchRelevanceInput.schema';
import { TaggingOrderByRelationAggregateInputObjectSchema } from './TaggingOrderByRelationAggregateInput.schema';
import { TagOrderByRelationAggregateInputObjectSchema } from './TagOrderByRelationAggregateInput.schema';
import { BookmarkOrderByRelationAggregateInputObjectSchema } from './BookmarkOrderByRelationAggregateInput.schema';
import { EntryTagOrderByRelationAggregateInputObjectSchema } from './EntryTagOrderByRelationAggregateInput.schema';
import { ContextOrderByRelationAggregateInputObjectSchema } from './ContextOrderByRelationAggregateInput.schema';
import { ContextNodeOrderByRelationAggregateInputObjectSchema } from './ContextNodeOrderByRelationAggregateInput.schema';
import { UserOrderByRelevanceInputObjectSchema } from './UserOrderByRelevanceInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserOrderByWithRelationAndSearchRelevanceInput> = z
	.object({
		id: z.lazy(() => SortOrderSchema).optional(),
		provider_id: z.lazy(() => SortOrderSchema).optional(),
		hashed_password: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		session: z.lazy(() => SessionOrderByRelationAggregateInputObjectSchema).optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
		email: z.lazy(() => SortOrderSchema).optional(),
		username: z.lazy(() => SortOrderSchema).optional(),
		followedBy: z.lazy(() => UserOrderByRelationAggregateInputObjectSchema).optional(),
		following: z.lazy(() => UserOrderByRelationAggregateInputObjectSchema).optional(),
		interactions: z.lazy(() => InteractionOrderByRelationAggregateInputObjectSchema).optional(),
		favorites: z.lazy(() => FavoriteOrderByRelationAggregateInputObjectSchema).optional(),
		articles: z.lazy(() => ArticleOrderByRelationAggregateInputObjectSchema).optional(),
		favoriteFolders: z
			.lazy(() => FavoriteFolderOrderByRelationAggregateInputObjectSchema)
			.optional(),
		collections: z.lazy(() => CollectionOrderByRelationAggregateInputObjectSchema).optional(),
		annotations: z.lazy(() => AnnotationOrderByRelationAggregateInputObjectSchema).optional(),
		subscriptions: z.lazy(() => SubscriptionOrderByRelationAggregateInputObjectSchema).optional(),
		documentData: z.lazy(() => EntryDataOrderByRelationAggregateInputObjectSchema).optional(),
		stylesheets: z.lazy(() => StylesheetOrderByRelationAggregateInputObjectSchema).optional(),
		states: z.lazy(() => StateOrderByRelationAggregateInputObjectSchema).optional(),
		default_state: z
			.lazy(() => StateOrderByWithRelationAndSearchRelevanceInputObjectSchema)
			.optional(),
		default_state_id: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		taggings: z.lazy(() => TaggingOrderByRelationAggregateInputObjectSchema).optional(),
		tags: z.lazy(() => TagOrderByRelationAggregateInputObjectSchema).optional(),
		bookmarks: z.lazy(() => BookmarkOrderByRelationAggregateInputObjectSchema).optional(),
		EntryTag: z.lazy(() => EntryTagOrderByRelationAggregateInputObjectSchema).optional(),
		context: z.lazy(() => ContextOrderByRelationAggregateInputObjectSchema).optional(),
		context_nodes: z.lazy(() => ContextNodeOrderByRelationAggregateInputObjectSchema).optional(),
		_relevance: z.lazy(() => UserOrderByRelevanceInputObjectSchema).optional(),
	})
	.strict();

export const UserOrderByWithRelationAndSearchRelevanceInputObjectSchema = Schema;
