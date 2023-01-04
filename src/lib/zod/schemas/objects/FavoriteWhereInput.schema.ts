import { z } from 'zod';
import { IntFilterObjectSchema } from './IntFilter.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema';
import { UserRelationFilterObjectSchema } from './UserRelationFilter.schema';
import { UserWhereInputObjectSchema } from './UserWhereInput.schema';
import { IntNullableFilterObjectSchema } from './IntNullableFilter.schema';
import { TagRelationFilterObjectSchema } from './TagRelationFilter.schema';
import { TagWhereInputObjectSchema } from './TagWhereInput.schema';
import { FeedRelationFilterObjectSchema } from './FeedRelationFilter.schema';
import { FeedWhereInputObjectSchema } from './FeedWhereInput.schema';
import { SmartListRelationFilterObjectSchema } from './SmartListRelationFilter.schema';
import { SmartListWhereInputObjectSchema } from './SmartListWhereInput.schema';
import { FavoriteFolderRelationFilterObjectSchema } from './FavoriteFolderRelationFilter.schema';
import { FavoriteFolderWhereInputObjectSchema } from './FavoriteFolderWhereInput.schema';
import { AnnotationRelationFilterObjectSchema } from './AnnotationRelationFilter.schema';
import { AnnotationWhereInputObjectSchema } from './AnnotationWhereInput.schema';
import { BookmarkRelationFilterObjectSchema } from './BookmarkRelationFilter.schema';
import { BookmarkWhereInputObjectSchema } from './BookmarkWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FavoriteWhereInput> = z
	.object({
		AND: z
			.union([
				z.lazy(() => FavoriteWhereInputObjectSchema),
				z.lazy(() => FavoriteWhereInputObjectSchema).array(),
			])
			.optional(),
		OR: z
			.lazy(() => FavoriteWhereInputObjectSchema)
			.array()
			.optional(),
		NOT: z
			.union([
				z.lazy(() => FavoriteWhereInputObjectSchema),
				z.lazy(() => FavoriteWhereInputObjectSchema).array(),
			])
			.optional(),
		id: z.union([z.lazy(() => IntFilterObjectSchema), z.number()]).optional(),
		createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
		updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
		userId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
		deleted: z
			.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.date()])
			.optional()
			.nullable(),
		user: z
			.union([
				z.lazy(() => UserRelationFilterObjectSchema),
				z.lazy(() => UserWhereInputObjectSchema),
			])
			.optional(),
		tagId: z
			.union([z.lazy(() => IntNullableFilterObjectSchema), z.number()])
			.optional()
			.nullable(),
		tag: z
			.union([z.lazy(() => TagRelationFilterObjectSchema), z.lazy(() => TagWhereInputObjectSchema)])
			.optional()
			.nullable(),
		rssId: z
			.union([z.lazy(() => IntNullableFilterObjectSchema), z.number()])
			.optional()
			.nullable(),
		rss: z
			.union([
				z.lazy(() => FeedRelationFilterObjectSchema),
				z.lazy(() => FeedWhereInputObjectSchema),
			])
			.optional()
			.nullable(),
		smartListId: z
			.union([z.lazy(() => IntNullableFilterObjectSchema), z.number()])
			.optional()
			.nullable(),
		smartList: z
			.union([
				z.lazy(() => SmartListRelationFilterObjectSchema),
				z.lazy(() => SmartListWhereInputObjectSchema),
			])
			.optional()
			.nullable(),
		folder: z
			.union([
				z.lazy(() => FavoriteFolderRelationFilterObjectSchema),
				z.lazy(() => FavoriteFolderWhereInputObjectSchema),
			])
			.optional()
			.nullable(),
		favoriteFolderId: z
			.union([z.lazy(() => IntNullableFilterObjectSchema), z.number()])
			.optional()
			.nullable(),
		annotation: z
			.union([
				z.lazy(() => AnnotationRelationFilterObjectSchema),
				z.lazy(() => AnnotationWhereInputObjectSchema),
			])
			.optional()
			.nullable(),
		annotationId: z
			.union([z.lazy(() => IntNullableFilterObjectSchema), z.number()])
			.optional()
			.nullable(),
		bookmark: z
			.union([
				z.lazy(() => BookmarkRelationFilterObjectSchema),
				z.lazy(() => BookmarkWhereInputObjectSchema),
			])
			.optional()
			.nullable(),
		bookmarkId: z
			.union([z.lazy(() => IntNullableFilterObjectSchema), z.number()])
			.optional()
			.nullable(),
	})
	.strict();

export const FavoriteWhereInputObjectSchema = Schema;
