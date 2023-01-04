import { z } from 'zod';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { SessionUncheckedUpdateManyWithoutUserNestedInputObjectSchema } from './SessionUncheckedUpdateManyWithoutUserNestedInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { UserUncheckedUpdateManyWithoutFollowingNestedInputObjectSchema } from './UserUncheckedUpdateManyWithoutFollowingNestedInput.schema';
import { UserUncheckedUpdateManyWithoutFollowedByNestedInputObjectSchema } from './UserUncheckedUpdateManyWithoutFollowedByNestedInput.schema';
import { InteractionUncheckedUpdateManyWithoutUserNestedInputObjectSchema } from './InteractionUncheckedUpdateManyWithoutUserNestedInput.schema';
import { FavoriteUncheckedUpdateManyWithoutUserNestedInputObjectSchema } from './FavoriteUncheckedUpdateManyWithoutUserNestedInput.schema';
import { ArticleUncheckedUpdateManyWithoutUserNestedInputObjectSchema } from './ArticleUncheckedUpdateManyWithoutUserNestedInput.schema';
import { FavoriteFolderUncheckedUpdateManyWithoutUserNestedInputObjectSchema } from './FavoriteFolderUncheckedUpdateManyWithoutUserNestedInput.schema';
import { CollectionUncheckedUpdateManyWithoutUserNestedInputObjectSchema } from './CollectionUncheckedUpdateManyWithoutUserNestedInput.schema';
import { AnnotationUncheckedUpdateManyWithoutCreatorNestedInputObjectSchema } from './AnnotationUncheckedUpdateManyWithoutCreatorNestedInput.schema';
import { SubscriptionUncheckedUpdateManyWithoutUserNestedInputObjectSchema } from './SubscriptionUncheckedUpdateManyWithoutUserNestedInput.schema';
import { EntryDataUncheckedUpdateManyWithoutUserNestedInputObjectSchema } from './EntryDataUncheckedUpdateManyWithoutUserNestedInput.schema';
import { StylesheetUncheckedUpdateManyWithoutUserNestedInputObjectSchema } from './StylesheetUncheckedUpdateManyWithoutUserNestedInput.schema';
import { StateUncheckedUpdateManyWithoutUserNestedInputObjectSchema } from './StateUncheckedUpdateManyWithoutUserNestedInput.schema';
import { NullableIntFieldUpdateOperationsInputObjectSchema } from './NullableIntFieldUpdateOperationsInput.schema';
import { TaggingUncheckedUpdateManyWithoutUserNestedInputObjectSchema } from './TaggingUncheckedUpdateManyWithoutUserNestedInput.schema';
import { TagUncheckedUpdateManyWithoutUserNestedInputObjectSchema } from './TagUncheckedUpdateManyWithoutUserNestedInput.schema';
import { BookmarkUncheckedUpdateManyWithoutUserNestedInputObjectSchema } from './BookmarkUncheckedUpdateManyWithoutUserNestedInput.schema';
import { EntryTagUncheckedUpdateManyWithoutUserNestedInputObjectSchema } from './EntryTagUncheckedUpdateManyWithoutUserNestedInput.schema';
import { ContextUncheckedUpdateManyWithoutUserNestedInputObjectSchema } from './ContextUncheckedUpdateManyWithoutUserNestedInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserUncheckedUpdateWithoutContext_nodesInput> = z
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
		session: z.lazy(() => SessionUncheckedUpdateManyWithoutUserNestedInputObjectSchema).optional(),
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
		followedBy: z
			.lazy(() => UserUncheckedUpdateManyWithoutFollowingNestedInputObjectSchema)
			.optional(),
		following: z
			.lazy(() => UserUncheckedUpdateManyWithoutFollowedByNestedInputObjectSchema)
			.optional(),
		interactions: z
			.lazy(() => InteractionUncheckedUpdateManyWithoutUserNestedInputObjectSchema)
			.optional(),
		favorites: z
			.lazy(() => FavoriteUncheckedUpdateManyWithoutUserNestedInputObjectSchema)
			.optional(),
		articles: z.lazy(() => ArticleUncheckedUpdateManyWithoutUserNestedInputObjectSchema).optional(),
		favoriteFolders: z
			.lazy(() => FavoriteFolderUncheckedUpdateManyWithoutUserNestedInputObjectSchema)
			.optional(),
		collections: z
			.lazy(() => CollectionUncheckedUpdateManyWithoutUserNestedInputObjectSchema)
			.optional(),
		annotations: z
			.lazy(() => AnnotationUncheckedUpdateManyWithoutCreatorNestedInputObjectSchema)
			.optional(),
		subscriptions: z
			.lazy(() => SubscriptionUncheckedUpdateManyWithoutUserNestedInputObjectSchema)
			.optional(),
		documentData: z
			.lazy(() => EntryDataUncheckedUpdateManyWithoutUserNestedInputObjectSchema)
			.optional(),
		stylesheets: z
			.lazy(() => StylesheetUncheckedUpdateManyWithoutUserNestedInputObjectSchema)
			.optional(),
		states: z.lazy(() => StateUncheckedUpdateManyWithoutUserNestedInputObjectSchema).optional(),
		default_state_id: z
			.union([z.number(), z.lazy(() => NullableIntFieldUpdateOperationsInputObjectSchema)])
			.optional()
			.nullable(),
		taggings: z.lazy(() => TaggingUncheckedUpdateManyWithoutUserNestedInputObjectSchema).optional(),
		tags: z.lazy(() => TagUncheckedUpdateManyWithoutUserNestedInputObjectSchema).optional(),
		bookmarks: z
			.lazy(() => BookmarkUncheckedUpdateManyWithoutUserNestedInputObjectSchema)
			.optional(),
		EntryTag: z
			.lazy(() => EntryTagUncheckedUpdateManyWithoutUserNestedInputObjectSchema)
			.optional(),
		context: z.lazy(() => ContextUncheckedUpdateManyWithoutUserNestedInputObjectSchema).optional(),
	})
	.strict();

export const UserUncheckedUpdateWithoutContext_nodesInputObjectSchema = Schema;
