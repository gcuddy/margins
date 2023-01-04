import { z } from 'zod';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { SessionUpdateManyWithoutUserNestedInputObjectSchema } from './SessionUpdateManyWithoutUserNestedInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { UserUpdateManyWithoutFollowingNestedInputObjectSchema } from './UserUpdateManyWithoutFollowingNestedInput.schema';
import { InteractionUpdateManyWithoutUserNestedInputObjectSchema } from './InteractionUpdateManyWithoutUserNestedInput.schema';
import { FavoriteUpdateManyWithoutUserNestedInputObjectSchema } from './FavoriteUpdateManyWithoutUserNestedInput.schema';
import { ArticleUpdateManyWithoutUserNestedInputObjectSchema } from './ArticleUpdateManyWithoutUserNestedInput.schema';
import { FavoriteFolderUpdateManyWithoutUserNestedInputObjectSchema } from './FavoriteFolderUpdateManyWithoutUserNestedInput.schema';
import { CollectionUpdateManyWithoutUserNestedInputObjectSchema } from './CollectionUpdateManyWithoutUserNestedInput.schema';
import { AnnotationUpdateManyWithoutCreatorNestedInputObjectSchema } from './AnnotationUpdateManyWithoutCreatorNestedInput.schema';
import { SubscriptionUpdateManyWithoutUserNestedInputObjectSchema } from './SubscriptionUpdateManyWithoutUserNestedInput.schema';
import { EntryDataUpdateManyWithoutUserNestedInputObjectSchema } from './EntryDataUpdateManyWithoutUserNestedInput.schema';
import { StylesheetUpdateManyWithoutUserNestedInputObjectSchema } from './StylesheetUpdateManyWithoutUserNestedInput.schema';
import { StateUpdateManyWithoutUserNestedInputObjectSchema } from './StateUpdateManyWithoutUserNestedInput.schema';
import { StateUpdateOneWithoutDefaultRelationNestedInputObjectSchema } from './StateUpdateOneWithoutDefaultRelationNestedInput.schema';
import { TaggingUpdateManyWithoutUserNestedInputObjectSchema } from './TaggingUpdateManyWithoutUserNestedInput.schema';
import { TagUpdateManyWithoutUserNestedInputObjectSchema } from './TagUpdateManyWithoutUserNestedInput.schema';
import { BookmarkUpdateManyWithoutUserNestedInputObjectSchema } from './BookmarkUpdateManyWithoutUserNestedInput.schema';
import { EntryTagUpdateManyWithoutUserNestedInputObjectSchema } from './EntryTagUpdateManyWithoutUserNestedInput.schema';
import { ContextUpdateManyWithoutUserNestedInputObjectSchema } from './ContextUpdateManyWithoutUserNestedInput.schema';
import { ContextNodeUpdateManyWithoutOwnerNestedInputObjectSchema } from './ContextNodeUpdateManyWithoutOwnerNestedInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserUpdateWithoutFollowingInput> = z
	.object({
		id: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)])
			.optional(),
		provider_id: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)])
			.optional(),
		hashed_password: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)])
			.optional()
			.nullable(),
		session: z.lazy(() => SessionUpdateManyWithoutUserNestedInputObjectSchema).optional(),
		createdAt: z
			.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)])
			.optional(),
		updatedAt: z
			.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)])
			.optional(),
		email: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)])
			.optional(),
		username: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)])
			.optional(),
		followedBy: z.lazy(() => UserUpdateManyWithoutFollowingNestedInputObjectSchema).optional(),
		interactions: z.lazy(() => InteractionUpdateManyWithoutUserNestedInputObjectSchema).optional(),
		favorites: z.lazy(() => FavoriteUpdateManyWithoutUserNestedInputObjectSchema).optional(),
		articles: z.lazy(() => ArticleUpdateManyWithoutUserNestedInputObjectSchema).optional(),
		favoriteFolders: z
			.lazy(() => FavoriteFolderUpdateManyWithoutUserNestedInputObjectSchema)
			.optional(),
		collections: z.lazy(() => CollectionUpdateManyWithoutUserNestedInputObjectSchema).optional(),
		annotations: z.lazy(() => AnnotationUpdateManyWithoutCreatorNestedInputObjectSchema).optional(),
		subscriptions: z
			.lazy(() => SubscriptionUpdateManyWithoutUserNestedInputObjectSchema)
			.optional(),
		documentData: z.lazy(() => EntryDataUpdateManyWithoutUserNestedInputObjectSchema).optional(),
		stylesheets: z.lazy(() => StylesheetUpdateManyWithoutUserNestedInputObjectSchema).optional(),
		states: z.lazy(() => StateUpdateManyWithoutUserNestedInputObjectSchema).optional(),
		default_state: z
			.lazy(() => StateUpdateOneWithoutDefaultRelationNestedInputObjectSchema)
			.optional(),
		taggings: z.lazy(() => TaggingUpdateManyWithoutUserNestedInputObjectSchema).optional(),
		tags: z.lazy(() => TagUpdateManyWithoutUserNestedInputObjectSchema).optional(),
		bookmarks: z.lazy(() => BookmarkUpdateManyWithoutUserNestedInputObjectSchema).optional(),
		EntryTag: z.lazy(() => EntryTagUpdateManyWithoutUserNestedInputObjectSchema).optional(),
		context: z.lazy(() => ContextUpdateManyWithoutUserNestedInputObjectSchema).optional(),
		context_nodes: z
			.lazy(() => ContextNodeUpdateManyWithoutOwnerNestedInputObjectSchema)
			.optional(),
	})
	.strict();

export const UserUpdateWithoutFollowingInputObjectSchema = Schema;
