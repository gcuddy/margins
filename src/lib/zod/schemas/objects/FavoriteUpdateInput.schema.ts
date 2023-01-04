import { z } from 'zod';
import { DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { NullableDateTimeFieldUpdateOperationsInputObjectSchema } from './NullableDateTimeFieldUpdateOperationsInput.schema';
import { UserUpdateOneRequiredWithoutFavoritesNestedInputObjectSchema } from './UserUpdateOneRequiredWithoutFavoritesNestedInput.schema';
import { TagUpdateOneWithoutFavoriteNestedInputObjectSchema } from './TagUpdateOneWithoutFavoriteNestedInput.schema';
import { FeedUpdateOneWithoutFavoriteNestedInputObjectSchema } from './FeedUpdateOneWithoutFavoriteNestedInput.schema';
import { SmartListUpdateOneWithoutFavoriteNestedInputObjectSchema } from './SmartListUpdateOneWithoutFavoriteNestedInput.schema';
import { FavoriteFolderUpdateOneWithoutFavoritesNestedInputObjectSchema } from './FavoriteFolderUpdateOneWithoutFavoritesNestedInput.schema';
import { AnnotationUpdateOneWithoutFavoriteNestedInputObjectSchema } from './AnnotationUpdateOneWithoutFavoriteNestedInput.schema';
import { BookmarkUpdateOneWithoutFavoriteNestedInputObjectSchema } from './BookmarkUpdateOneWithoutFavoriteNestedInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FavoriteUpdateInput> = z
	.object({
		createdAt: z
			.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)])
			.optional(),
		updatedAt: z
			.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)])
			.optional(),
		deleted: z
			.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)])
			.optional()
			.nullable(),
		user: z.lazy(() => UserUpdateOneRequiredWithoutFavoritesNestedInputObjectSchema).optional(),
		tag: z.lazy(() => TagUpdateOneWithoutFavoriteNestedInputObjectSchema).optional(),
		rss: z.lazy(() => FeedUpdateOneWithoutFavoriteNestedInputObjectSchema).optional(),
		smartList: z.lazy(() => SmartListUpdateOneWithoutFavoriteNestedInputObjectSchema).optional(),
		folder: z.lazy(() => FavoriteFolderUpdateOneWithoutFavoritesNestedInputObjectSchema).optional(),
		annotation: z.lazy(() => AnnotationUpdateOneWithoutFavoriteNestedInputObjectSchema).optional(),
		bookmark: z.lazy(() => BookmarkUpdateOneWithoutFavoriteNestedInputObjectSchema).optional(),
	})
	.strict();

export const FavoriteUpdateInputObjectSchema = Schema;
