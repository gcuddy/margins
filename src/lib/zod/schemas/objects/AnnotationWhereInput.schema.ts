import { z } from 'zod';
import { IntFilterObjectSchema } from './IntFilter.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { JsonNullableFilterObjectSchema } from './JsonNullableFilter.schema';
import { TaggingListRelationFilterObjectSchema } from './TaggingListRelationFilter.schema';
import { EnumAnnotationTypeFilterObjectSchema } from './EnumAnnotationTypeFilter.schema';
import { AnnotationTypeSchema } from '../enums/AnnotationType.schema';
import { BoolFilterObjectSchema } from './BoolFilter.schema';
import { EntryRelationFilterObjectSchema } from './EntryRelationFilter.schema';
import { EntryWhereInputObjectSchema } from './EntryWhereInput.schema';
import { IntNullableFilterObjectSchema } from './IntNullableFilter.schema';
import { AnnotationRelationFilterObjectSchema } from './AnnotationRelationFilter.schema';
import { AnnotationListRelationFilterObjectSchema } from './AnnotationListRelationFilter.schema';
import { DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema';
import { UserRelationFilterObjectSchema } from './UserRelationFilter.schema';
import { UserWhereInputObjectSchema } from './UserWhereInput.schema';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { FloatFilterObjectSchema } from './FloatFilter.schema';
import { CollectionItemsRelationFilterObjectSchema } from './CollectionItemsRelationFilter.schema';
import { CollectionItemsWhereInputObjectSchema } from './CollectionItemsWhereInput.schema';
import { FavoriteRelationFilterObjectSchema } from './FavoriteRelationFilter.schema';
import { FavoriteWhereInputObjectSchema } from './FavoriteWhereInput.schema';
import { BookmarkRelationFilterObjectSchema } from './BookmarkRelationFilter.schema';
import { BookmarkWhereInputObjectSchema } from './BookmarkWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.AnnotationWhereInput> = z
	.object({
		AND: z
			.union([
				z.lazy(() => AnnotationWhereInputObjectSchema),
				z.lazy(() => AnnotationWhereInputObjectSchema).array(),
			])
			.optional(),
		OR: z
			.lazy(() => AnnotationWhereInputObjectSchema)
			.array()
			.optional(),
		NOT: z
			.union([
				z.lazy(() => AnnotationWhereInputObjectSchema),
				z.lazy(() => AnnotationWhereInputObjectSchema).array(),
			])
			.optional(),
		id: z.union([z.lazy(() => IntFilterObjectSchema), z.number()]).optional(),
		createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
		updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
		body: z.lazy(() => JsonNullableFilterObjectSchema).optional(),
		tags: z.lazy(() => TaggingListRelationFilterObjectSchema).optional(),
		type: z
			.union([
				z.lazy(() => EnumAnnotationTypeFilterObjectSchema),
				z.lazy(() => AnnotationTypeSchema),
			])
			.optional(),
		private: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
		target: z.lazy(() => JsonNullableFilterObjectSchema).optional(),
		entry: z
			.union([
				z.lazy(() => EntryRelationFilterObjectSchema),
				z.lazy(() => EntryWhereInputObjectSchema),
			])
			.optional()
			.nullable(),
		entryId: z
			.union([z.lazy(() => IntNullableFilterObjectSchema), z.number()])
			.optional()
			.nullable(),
		parent: z
			.union([
				z.lazy(() => AnnotationRelationFilterObjectSchema),
				z.lazy(() => AnnotationWhereInputObjectSchema),
			])
			.optional()
			.nullable(),
		parentId: z
			.union([z.lazy(() => IntNullableFilterObjectSchema), z.number()])
			.optional()
			.nullable(),
		children: z.lazy(() => AnnotationListRelationFilterObjectSchema).optional(),
		deleted: z
			.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.date()])
			.optional()
			.nullable(),
		creator: z
			.union([
				z.lazy(() => UserRelationFilterObjectSchema),
				z.lazy(() => UserWhereInputObjectSchema),
			])
			.optional(),
		userId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
		sortOrder: z.union([z.lazy(() => FloatFilterObjectSchema), z.number()]).optional(),
		collections: z
			.union([
				z.lazy(() => CollectionItemsRelationFilterObjectSchema),
				z.lazy(() => CollectionItemsWhereInputObjectSchema),
			])
			.optional()
			.nullable(),
		favorite: z
			.union([
				z.lazy(() => FavoriteRelationFilterObjectSchema),
				z.lazy(() => FavoriteWhereInputObjectSchema),
			])
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

export const AnnotationWhereInputObjectSchema = Schema;
