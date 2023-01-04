import { z } from 'zod';
import { SessionUncheckedCreateNestedManyWithoutUserInputObjectSchema } from './SessionUncheckedCreateNestedManyWithoutUserInput.schema';
import { UserUncheckedCreateNestedManyWithoutFollowingInputObjectSchema } from './UserUncheckedCreateNestedManyWithoutFollowingInput.schema';
import { UserUncheckedCreateNestedManyWithoutFollowedByInputObjectSchema } from './UserUncheckedCreateNestedManyWithoutFollowedByInput.schema';
import { InteractionUncheckedCreateNestedManyWithoutUserInputObjectSchema } from './InteractionUncheckedCreateNestedManyWithoutUserInput.schema';
import { FavoriteUncheckedCreateNestedManyWithoutUserInputObjectSchema } from './FavoriteUncheckedCreateNestedManyWithoutUserInput.schema';
import { ArticleUncheckedCreateNestedManyWithoutUserInputObjectSchema } from './ArticleUncheckedCreateNestedManyWithoutUserInput.schema';
import { FavoriteFolderUncheckedCreateNestedManyWithoutUserInputObjectSchema } from './FavoriteFolderUncheckedCreateNestedManyWithoutUserInput.schema';
import { CollectionUncheckedCreateNestedManyWithoutUserInputObjectSchema } from './CollectionUncheckedCreateNestedManyWithoutUserInput.schema';
import { AnnotationUncheckedCreateNestedManyWithoutCreatorInputObjectSchema } from './AnnotationUncheckedCreateNestedManyWithoutCreatorInput.schema';
import { SubscriptionUncheckedCreateNestedManyWithoutUserInputObjectSchema } from './SubscriptionUncheckedCreateNestedManyWithoutUserInput.schema';
import { EntryDataUncheckedCreateNestedManyWithoutUserInputObjectSchema } from './EntryDataUncheckedCreateNestedManyWithoutUserInput.schema';
import { StylesheetUncheckedCreateNestedManyWithoutUserInputObjectSchema } from './StylesheetUncheckedCreateNestedManyWithoutUserInput.schema';
import { StateUncheckedCreateNestedManyWithoutUserInputObjectSchema } from './StateUncheckedCreateNestedManyWithoutUserInput.schema';
import { TaggingUncheckedCreateNestedManyWithoutUserInputObjectSchema } from './TaggingUncheckedCreateNestedManyWithoutUserInput.schema';
import { TagUncheckedCreateNestedManyWithoutUserInputObjectSchema } from './TagUncheckedCreateNestedManyWithoutUserInput.schema';
import { BookmarkUncheckedCreateNestedManyWithoutUserInputObjectSchema } from './BookmarkUncheckedCreateNestedManyWithoutUserInput.schema';
import { EntryTagUncheckedCreateNestedManyWithoutUserInputObjectSchema } from './EntryTagUncheckedCreateNestedManyWithoutUserInput.schema';
import { ContextNodeUncheckedCreateNestedManyWithoutOwnerInputObjectSchema } from './ContextNodeUncheckedCreateNestedManyWithoutOwnerInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserUncheckedCreateWithoutContextInput> = z
	.object({
		id: z.string().optional(),
		provider_id: z.string(),
		hashed_password: z.string().optional().nullable(),
		session: z.lazy(() => SessionUncheckedCreateNestedManyWithoutUserInputObjectSchema).optional(),
		createdAt: z.date().optional(),
		updatedAt: z.date().optional(),
		email: z.string(),
		username: z.string(),
		followedBy: z
			.lazy(() => UserUncheckedCreateNestedManyWithoutFollowingInputObjectSchema)
			.optional(),
		following: z
			.lazy(() => UserUncheckedCreateNestedManyWithoutFollowedByInputObjectSchema)
			.optional(),
		interactions: z
			.lazy(() => InteractionUncheckedCreateNestedManyWithoutUserInputObjectSchema)
			.optional(),
		favorites: z
			.lazy(() => FavoriteUncheckedCreateNestedManyWithoutUserInputObjectSchema)
			.optional(),
		articles: z.lazy(() => ArticleUncheckedCreateNestedManyWithoutUserInputObjectSchema).optional(),
		favoriteFolders: z
			.lazy(() => FavoriteFolderUncheckedCreateNestedManyWithoutUserInputObjectSchema)
			.optional(),
		collections: z
			.lazy(() => CollectionUncheckedCreateNestedManyWithoutUserInputObjectSchema)
			.optional(),
		annotations: z
			.lazy(() => AnnotationUncheckedCreateNestedManyWithoutCreatorInputObjectSchema)
			.optional(),
		subscriptions: z
			.lazy(() => SubscriptionUncheckedCreateNestedManyWithoutUserInputObjectSchema)
			.optional(),
		documentData: z
			.lazy(() => EntryDataUncheckedCreateNestedManyWithoutUserInputObjectSchema)
			.optional(),
		stylesheets: z
			.lazy(() => StylesheetUncheckedCreateNestedManyWithoutUserInputObjectSchema)
			.optional(),
		states: z.lazy(() => StateUncheckedCreateNestedManyWithoutUserInputObjectSchema).optional(),
		default_state_id: z.number().optional().nullable(),
		taggings: z.lazy(() => TaggingUncheckedCreateNestedManyWithoutUserInputObjectSchema).optional(),
		tags: z.lazy(() => TagUncheckedCreateNestedManyWithoutUserInputObjectSchema).optional(),
		bookmarks: z
			.lazy(() => BookmarkUncheckedCreateNestedManyWithoutUserInputObjectSchema)
			.optional(),
		EntryTag: z
			.lazy(() => EntryTagUncheckedCreateNestedManyWithoutUserInputObjectSchema)
			.optional(),
		context_nodes: z
			.lazy(() => ContextNodeUncheckedCreateNestedManyWithoutOwnerInputObjectSchema)
			.optional(),
	})
	.strict();

export const UserUncheckedCreateWithoutContextInputObjectSchema = Schema;
