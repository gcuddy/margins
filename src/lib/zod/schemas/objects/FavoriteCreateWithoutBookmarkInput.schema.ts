import { z } from 'zod';
import { UserCreateNestedOneWithoutFavoritesInputObjectSchema } from './UserCreateNestedOneWithoutFavoritesInput.schema';
import { TagCreateNestedOneWithoutFavoriteInputObjectSchema } from './TagCreateNestedOneWithoutFavoriteInput.schema';
import { FeedCreateNestedOneWithoutFavoriteInputObjectSchema } from './FeedCreateNestedOneWithoutFavoriteInput.schema';
import { SmartListCreateNestedOneWithoutFavoriteInputObjectSchema } from './SmartListCreateNestedOneWithoutFavoriteInput.schema';
import { FavoriteFolderCreateNestedOneWithoutFavoritesInputObjectSchema } from './FavoriteFolderCreateNestedOneWithoutFavoritesInput.schema';
import { AnnotationCreateNestedOneWithoutFavoriteInputObjectSchema } from './AnnotationCreateNestedOneWithoutFavoriteInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FavoriteCreateWithoutBookmarkInput> = z
	.object({
		createdAt: z.date().optional(),
		updatedAt: z.date().optional(),
		deleted: z.date().optional().nullable(),
		user: z.lazy(() => UserCreateNestedOneWithoutFavoritesInputObjectSchema),
		tag: z.lazy(() => TagCreateNestedOneWithoutFavoriteInputObjectSchema).optional(),
		rss: z.lazy(() => FeedCreateNestedOneWithoutFavoriteInputObjectSchema).optional(),
		smartList: z.lazy(() => SmartListCreateNestedOneWithoutFavoriteInputObjectSchema).optional(),
		folder: z.lazy(() => FavoriteFolderCreateNestedOneWithoutFavoritesInputObjectSchema).optional(),
		annotation: z.lazy(() => AnnotationCreateNestedOneWithoutFavoriteInputObjectSchema).optional(),
	})
	.strict();

export const FavoriteCreateWithoutBookmarkInputObjectSchema = Schema;
