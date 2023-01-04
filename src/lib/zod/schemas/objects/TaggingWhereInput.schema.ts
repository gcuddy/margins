import { z } from 'zod';
import { IntFilterObjectSchema } from './IntFilter.schema';
import { TagRelationFilterObjectSchema } from './TagRelationFilter.schema';
import { TagWhereInputObjectSchema } from './TagWhereInput.schema';
import { UserRelationFilterObjectSchema } from './UserRelationFilter.schema';
import { UserWhereInputObjectSchema } from './UserWhereInput.schema';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { FeedRelationFilterObjectSchema } from './FeedRelationFilter.schema';
import { FeedWhereInputObjectSchema } from './FeedWhereInput.schema';
import { IntNullableFilterObjectSchema } from './IntNullableFilter.schema';
import { AnnotationRelationFilterObjectSchema } from './AnnotationRelationFilter.schema';
import { AnnotationWhereInputObjectSchema } from './AnnotationWhereInput.schema';
import { BookmarkRelationFilterObjectSchema } from './BookmarkRelationFilter.schema';
import { BookmarkWhereInputObjectSchema } from './BookmarkWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.TaggingWhereInput> = z
	.object({
		AND: z
			.union([
				z.lazy(() => TaggingWhereInputObjectSchema),
				z.lazy(() => TaggingWhereInputObjectSchema).array(),
			])
			.optional(),
		OR: z
			.lazy(() => TaggingWhereInputObjectSchema)
			.array()
			.optional(),
		NOT: z
			.union([
				z.lazy(() => TaggingWhereInputObjectSchema),
				z.lazy(() => TaggingWhereInputObjectSchema).array(),
			])
			.optional(),
		id: z.union([z.lazy(() => IntFilterObjectSchema), z.number()]).optional(),
		tag: z
			.union([z.lazy(() => TagRelationFilterObjectSchema), z.lazy(() => TagWhereInputObjectSchema)])
			.optional(),
		tagId: z.union([z.lazy(() => IntFilterObjectSchema), z.number()]).optional(),
		user: z
			.union([
				z.lazy(() => UserRelationFilterObjectSchema),
				z.lazy(() => UserWhereInputObjectSchema),
			])
			.optional(),
		userId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
		feed: z
			.union([
				z.lazy(() => FeedRelationFilterObjectSchema),
				z.lazy(() => FeedWhereInputObjectSchema),
			])
			.optional()
			.nullable(),
		feedId: z
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

export const TaggingWhereInputObjectSchema = Schema;
