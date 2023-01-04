import { z } from 'zod';
import { UserCreateNestedOneWithoutFavoritesInputObjectSchema } from './UserCreateNestedOneWithoutFavoritesInput.schema';
import { TagCreateNestedOneWithoutFavoriteInputObjectSchema } from './TagCreateNestedOneWithoutFavoriteInput.schema';
import { FeedCreateNestedOneWithoutFavoriteInputObjectSchema } from './FeedCreateNestedOneWithoutFavoriteInput.schema';
import { SmartListCreateNestedOneWithoutFavoriteInputObjectSchema } from './SmartListCreateNestedOneWithoutFavoriteInput.schema';
import { AnnotationCreateNestedOneWithoutFavoriteInputObjectSchema } from './AnnotationCreateNestedOneWithoutFavoriteInput.schema';
import { BookmarkCreateNestedOneWithoutFavoriteInputObjectSchema } from './BookmarkCreateNestedOneWithoutFavoriteInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FavoriteCreateWithoutFolderInput> = z
	.object({
		createdAt: z.date().optional(),
		updatedAt: z.date().optional(),
		deleted: z.date().optional().nullable(),
		user: z.lazy(() => UserCreateNestedOneWithoutFavoritesInputObjectSchema),
		tag: z.lazy(() => TagCreateNestedOneWithoutFavoriteInputObjectSchema).optional(),
		rss: z.lazy(() => FeedCreateNestedOneWithoutFavoriteInputObjectSchema).optional(),
		smartList: z.lazy(() => SmartListCreateNestedOneWithoutFavoriteInputObjectSchema).optional(),
		annotation: z.lazy(() => AnnotationCreateNestedOneWithoutFavoriteInputObjectSchema).optional(),
		bookmark: z.lazy(() => BookmarkCreateNestedOneWithoutFavoriteInputObjectSchema).optional(),
	})
	.strict();

export const FavoriteCreateWithoutFolderInputObjectSchema = Schema;
