import { z } from 'zod';
import { UserCreateNestedOneWithoutFavoritesInputObjectSchema } from './UserCreateNestedOneWithoutFavoritesInput.schema';
import { TagCreateNestedOneWithoutFavoriteInputObjectSchema } from './TagCreateNestedOneWithoutFavoriteInput.schema';
import { SmartListCreateNestedOneWithoutFavoriteInputObjectSchema } from './SmartListCreateNestedOneWithoutFavoriteInput.schema';
import { FavoriteFolderCreateNestedOneWithoutFavoritesInputObjectSchema } from './FavoriteFolderCreateNestedOneWithoutFavoritesInput.schema';
import { AnnotationCreateNestedOneWithoutFavoriteInputObjectSchema } from './AnnotationCreateNestedOneWithoutFavoriteInput.schema';
import { BookmarkCreateNestedOneWithoutFavoriteInputObjectSchema } from './BookmarkCreateNestedOneWithoutFavoriteInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FavoriteCreateWithoutRssInput> = z
	.object({
		createdAt: z.date().optional(),
		updatedAt: z.date().optional(),
		deleted: z.date().optional().nullable(),
		user: z.lazy(() => UserCreateNestedOneWithoutFavoritesInputObjectSchema),
		tag: z.lazy(() => TagCreateNestedOneWithoutFavoriteInputObjectSchema).optional(),
		smartList: z.lazy(() => SmartListCreateNestedOneWithoutFavoriteInputObjectSchema).optional(),
		folder: z.lazy(() => FavoriteFolderCreateNestedOneWithoutFavoritesInputObjectSchema).optional(),
		annotation: z.lazy(() => AnnotationCreateNestedOneWithoutFavoriteInputObjectSchema).optional(),
		bookmark: z.lazy(() => BookmarkCreateNestedOneWithoutFavoriteInputObjectSchema).optional(),
	})
	.strict();

export const FavoriteCreateWithoutRssInputObjectSchema = Schema;
