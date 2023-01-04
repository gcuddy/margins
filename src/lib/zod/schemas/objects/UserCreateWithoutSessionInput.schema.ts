import { z } from 'zod';
import { UserCreateNestedManyWithoutFollowingInputObjectSchema } from './UserCreateNestedManyWithoutFollowingInput.schema';
import { UserCreateNestedManyWithoutFollowedByInputObjectSchema } from './UserCreateNestedManyWithoutFollowedByInput.schema';
import { InteractionCreateNestedManyWithoutUserInputObjectSchema } from './InteractionCreateNestedManyWithoutUserInput.schema';
import { FavoriteCreateNestedManyWithoutUserInputObjectSchema } from './FavoriteCreateNestedManyWithoutUserInput.schema';
import { ArticleCreateNestedManyWithoutUserInputObjectSchema } from './ArticleCreateNestedManyWithoutUserInput.schema';
import { FavoriteFolderCreateNestedManyWithoutUserInputObjectSchema } from './FavoriteFolderCreateNestedManyWithoutUserInput.schema';
import { CollectionCreateNestedManyWithoutUserInputObjectSchema } from './CollectionCreateNestedManyWithoutUserInput.schema';
import { AnnotationCreateNestedManyWithoutCreatorInputObjectSchema } from './AnnotationCreateNestedManyWithoutCreatorInput.schema';
import { SubscriptionCreateNestedManyWithoutUserInputObjectSchema } from './SubscriptionCreateNestedManyWithoutUserInput.schema';
import { EntryDataCreateNestedManyWithoutUserInputObjectSchema } from './EntryDataCreateNestedManyWithoutUserInput.schema';
import { StylesheetCreateNestedManyWithoutUserInputObjectSchema } from './StylesheetCreateNestedManyWithoutUserInput.schema';
import { StateCreateNestedManyWithoutUserInputObjectSchema } from './StateCreateNestedManyWithoutUserInput.schema';
import { StateCreateNestedOneWithoutDefaultRelationInputObjectSchema } from './StateCreateNestedOneWithoutDefaultRelationInput.schema';
import { TaggingCreateNestedManyWithoutUserInputObjectSchema } from './TaggingCreateNestedManyWithoutUserInput.schema';
import { TagCreateNestedManyWithoutUserInputObjectSchema } from './TagCreateNestedManyWithoutUserInput.schema';
import { BookmarkCreateNestedManyWithoutUserInputObjectSchema } from './BookmarkCreateNestedManyWithoutUserInput.schema';
import { EntryTagCreateNestedManyWithoutUserInputObjectSchema } from './EntryTagCreateNestedManyWithoutUserInput.schema';
import { ContextCreateNestedManyWithoutUserInputObjectSchema } from './ContextCreateNestedManyWithoutUserInput.schema';
import { ContextNodeCreateNestedManyWithoutOwnerInputObjectSchema } from './ContextNodeCreateNestedManyWithoutOwnerInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserCreateWithoutSessionInput> = z
	.object({
		id: z.string().optional(),
		provider_id: z.string(),
		hashed_password: z.string().optional().nullable(),
		createdAt: z.date().optional(),
		updatedAt: z.date().optional(),
		email: z.string(),
		username: z.string(),
		followedBy: z.lazy(() => UserCreateNestedManyWithoutFollowingInputObjectSchema).optional(),
		following: z.lazy(() => UserCreateNestedManyWithoutFollowedByInputObjectSchema).optional(),
		interactions: z.lazy(() => InteractionCreateNestedManyWithoutUserInputObjectSchema).optional(),
		favorites: z.lazy(() => FavoriteCreateNestedManyWithoutUserInputObjectSchema).optional(),
		articles: z.lazy(() => ArticleCreateNestedManyWithoutUserInputObjectSchema).optional(),
		favoriteFolders: z
			.lazy(() => FavoriteFolderCreateNestedManyWithoutUserInputObjectSchema)
			.optional(),
		collections: z.lazy(() => CollectionCreateNestedManyWithoutUserInputObjectSchema).optional(),
		annotations: z.lazy(() => AnnotationCreateNestedManyWithoutCreatorInputObjectSchema).optional(),
		subscriptions: z
			.lazy(() => SubscriptionCreateNestedManyWithoutUserInputObjectSchema)
			.optional(),
		documentData: z.lazy(() => EntryDataCreateNestedManyWithoutUserInputObjectSchema).optional(),
		stylesheets: z.lazy(() => StylesheetCreateNestedManyWithoutUserInputObjectSchema).optional(),
		states: z.lazy(() => StateCreateNestedManyWithoutUserInputObjectSchema).optional(),
		default_state: z
			.lazy(() => StateCreateNestedOneWithoutDefaultRelationInputObjectSchema)
			.optional(),
		taggings: z.lazy(() => TaggingCreateNestedManyWithoutUserInputObjectSchema).optional(),
		tags: z.lazy(() => TagCreateNestedManyWithoutUserInputObjectSchema).optional(),
		bookmarks: z.lazy(() => BookmarkCreateNestedManyWithoutUserInputObjectSchema).optional(),
		EntryTag: z.lazy(() => EntryTagCreateNestedManyWithoutUserInputObjectSchema).optional(),
		context: z.lazy(() => ContextCreateNestedManyWithoutUserInputObjectSchema).optional(),
		context_nodes: z
			.lazy(() => ContextNodeCreateNestedManyWithoutOwnerInputObjectSchema)
			.optional(),
	})
	.strict();

export const UserCreateWithoutSessionInputObjectSchema = Schema;
