import { z } from 'zod';
import { IntFilterObjectSchema } from './IntFilter.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { JsonNullableFilterObjectSchema } from './JsonNullableFilter.schema';
import { EntryRelationFilterObjectSchema } from './EntryRelationFilter.schema';
import { EntryWhereInputObjectSchema } from './EntryWhereInput.schema';
import { StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { IntNullableFilterObjectSchema } from './IntNullableFilter.schema';
import { UserRelationFilterObjectSchema } from './UserRelationFilter.schema';
import { UserWhereInputObjectSchema } from './UserWhereInput.schema';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { BoolFilterObjectSchema } from './BoolFilter.schema';
import { FloatFilterObjectSchema } from './FloatFilter.schema';
import { StateRelationFilterObjectSchema } from './StateRelationFilter.schema';
import { StateWhereInputObjectSchema } from './StateWhereInput.schema';
import { TaggingListRelationFilterObjectSchema } from './TaggingListRelationFilter.schema';
import { CollectionItemsListRelationFilterObjectSchema } from './CollectionItemsListRelationFilter.schema';
import { InteractionRelationFilterObjectSchema } from './InteractionRelationFilter.schema';
import { InteractionWhereInputObjectSchema } from './InteractionWhereInput.schema';
import { FavoriteRelationFilterObjectSchema } from './FavoriteRelationFilter.schema';
import { FavoriteWhereInputObjectSchema } from './FavoriteWhereInput.schema';
import { AnnotationListRelationFilterObjectSchema } from './AnnotationListRelationFilter.schema';
import { DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.BookmarkWhereInput> = z
	.object({
		AND: z
			.union([
				z.lazy(() => BookmarkWhereInputObjectSchema),
				z.lazy(() => BookmarkWhereInputObjectSchema).array(),
			])
			.optional(),
		OR: z
			.lazy(() => BookmarkWhereInputObjectSchema)
			.array()
			.optional(),
		NOT: z
			.union([
				z.lazy(() => BookmarkWhereInputObjectSchema),
				z.lazy(() => BookmarkWhereInputObjectSchema).array(),
			])
			.optional(),
		id: z.union([z.lazy(() => IntFilterObjectSchema), z.number()]).optional(),
		createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
		updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
		context: z.lazy(() => JsonNullableFilterObjectSchema).optional(),
		entry: z
			.union([
				z.lazy(() => EntryRelationFilterObjectSchema),
				z.lazy(() => EntryWhereInputObjectSchema),
			])
			.optional()
			.nullable(),
		uri: z
			.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()])
			.optional()
			.nullable(),
		entryId: z
			.union([z.lazy(() => IntNullableFilterObjectSchema), z.number()])
			.optional()
			.nullable(),
		user: z
			.union([
				z.lazy(() => UserRelationFilterObjectSchema),
				z.lazy(() => UserWhereInputObjectSchema),
			])
			.optional(),
		userId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
		sortOrder: z
			.union([z.lazy(() => IntNullableFilterObjectSchema), z.number()])
			.optional()
			.nullable(),
		is_read: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
		progress: z.union([z.lazy(() => FloatFilterObjectSchema), z.number()]).optional(),
		data: z.lazy(() => JsonNullableFilterObjectSchema).optional(),
		state: z
			.union([
				z.lazy(() => StateRelationFilterObjectSchema),
				z.lazy(() => StateWhereInputObjectSchema),
			])
			.optional()
			.nullable(),
		stateId: z
			.union([z.lazy(() => IntNullableFilterObjectSchema), z.number()])
			.optional()
			.nullable(),
		private: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
		tags: z.lazy(() => TaggingListRelationFilterObjectSchema).optional(),
		collections: z.lazy(() => CollectionItemsListRelationFilterObjectSchema).optional(),
		interaction: z
			.union([
				z.lazy(() => InteractionRelationFilterObjectSchema),
				z.lazy(() => InteractionWhereInputObjectSchema),
			])
			.optional()
			.nullable(),
		interactionId: z
			.union([z.lazy(() => IntNullableFilterObjectSchema), z.number()])
			.optional()
			.nullable(),
		favorite: z
			.union([
				z.lazy(() => FavoriteRelationFilterObjectSchema),
				z.lazy(() => FavoriteWhereInputObjectSchema),
			])
			.optional()
			.nullable(),
		favoriteId: z
			.union([z.lazy(() => IntNullableFilterObjectSchema), z.number()])
			.optional()
			.nullable(),
		annotations: z.lazy(() => AnnotationListRelationFilterObjectSchema).optional(),
		deleted: z
			.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.date()])
			.optional()
			.nullable(),
	})
	.strict();

export const BookmarkWhereInputObjectSchema = Schema;
