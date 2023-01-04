import { z } from 'zod';
import { UserWhereInputObjectSchema } from './UserWhereInput.schema';
import { StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { SessionListRelationFilterObjectSchema } from './SessionListRelationFilter.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { UserListRelationFilterObjectSchema } from './UserListRelationFilter.schema';
import { InteractionListRelationFilterObjectSchema } from './InteractionListRelationFilter.schema';
import { FavoriteListRelationFilterObjectSchema } from './FavoriteListRelationFilter.schema';
import { ArticleListRelationFilterObjectSchema } from './ArticleListRelationFilter.schema';
import { FavoriteFolderListRelationFilterObjectSchema } from './FavoriteFolderListRelationFilter.schema';
import { CollectionListRelationFilterObjectSchema } from './CollectionListRelationFilter.schema';
import { AnnotationListRelationFilterObjectSchema } from './AnnotationListRelationFilter.schema';
import { SubscriptionListRelationFilterObjectSchema } from './SubscriptionListRelationFilter.schema';
import { EntryDataListRelationFilterObjectSchema } from './EntryDataListRelationFilter.schema';
import { StylesheetListRelationFilterObjectSchema } from './StylesheetListRelationFilter.schema';
import { StateListRelationFilterObjectSchema } from './StateListRelationFilter.schema';
import { StateRelationFilterObjectSchema } from './StateRelationFilter.schema';
import { StateWhereInputObjectSchema } from './StateWhereInput.schema';
import { TaggingListRelationFilterObjectSchema } from './TaggingListRelationFilter.schema';
import { TagListRelationFilterObjectSchema } from './TagListRelationFilter.schema';
import { BookmarkListRelationFilterObjectSchema } from './BookmarkListRelationFilter.schema';
import { EntryTagListRelationFilterObjectSchema } from './EntryTagListRelationFilter.schema';
import { ContextListRelationFilterObjectSchema } from './ContextListRelationFilter.schema';
import { ContextNodeListRelationFilterObjectSchema } from './ContextNodeListRelationFilter.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserWhereUniqueInput> = z
	.object({
		id: z.string().optional(),
		provider_id: z.string().optional(),
		email: z.string().optional(),
		username: z.string().optional(),
		default_state_id: z.number().optional(),
		AND: z
			.union([
				z.lazy(() => UserWhereInputObjectSchema),
				z.lazy(() => UserWhereInputObjectSchema).array(),
			])
			.optional(),
		OR: z
			.lazy(() => UserWhereInputObjectSchema)
			.array()
			.optional(),
		NOT: z
			.union([
				z.lazy(() => UserWhereInputObjectSchema),
				z.lazy(() => UserWhereInputObjectSchema).array(),
			])
			.optional(),
		hashed_password: z
			.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()])
			.optional()
			.nullable(),
		session: z.lazy(() => SessionListRelationFilterObjectSchema).optional(),
		createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
		updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
		followedBy: z.lazy(() => UserListRelationFilterObjectSchema).optional(),
		following: z.lazy(() => UserListRelationFilterObjectSchema).optional(),
		interactions: z.lazy(() => InteractionListRelationFilterObjectSchema).optional(),
		favorites: z.lazy(() => FavoriteListRelationFilterObjectSchema).optional(),
		articles: z.lazy(() => ArticleListRelationFilterObjectSchema).optional(),
		favoriteFolders: z.lazy(() => FavoriteFolderListRelationFilterObjectSchema).optional(),
		collections: z.lazy(() => CollectionListRelationFilterObjectSchema).optional(),
		annotations: z.lazy(() => AnnotationListRelationFilterObjectSchema).optional(),
		subscriptions: z.lazy(() => SubscriptionListRelationFilterObjectSchema).optional(),
		documentData: z.lazy(() => EntryDataListRelationFilterObjectSchema).optional(),
		stylesheets: z.lazy(() => StylesheetListRelationFilterObjectSchema).optional(),
		states: z.lazy(() => StateListRelationFilterObjectSchema).optional(),
		default_state: z
			.union([
				z.lazy(() => StateRelationFilterObjectSchema),
				z.lazy(() => StateWhereInputObjectSchema),
			])
			.optional()
			.nullable(),
		taggings: z.lazy(() => TaggingListRelationFilterObjectSchema).optional(),
		tags: z.lazy(() => TagListRelationFilterObjectSchema).optional(),
		bookmarks: z.lazy(() => BookmarkListRelationFilterObjectSchema).optional(),
		EntryTag: z.lazy(() => EntryTagListRelationFilterObjectSchema).optional(),
		context: z.lazy(() => ContextListRelationFilterObjectSchema).optional(),
		context_nodes: z.lazy(() => ContextNodeListRelationFilterObjectSchema).optional(),
	})
	.strict();

export const UserWhereUniqueInputObjectSchema = Schema;
