import { z } from 'zod';
import { EntryUriIdCompoundUniqueInputObjectSchema } from './EntryUriIdCompoundUniqueInput.schema';
import { EntryWhereInputObjectSchema } from './EntryWhereInput.schema';
import { EntryDataListRelationFilterObjectSchema } from './EntryDataListRelationFilter.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { EnumLocationNullableFilterObjectSchema } from './EnumLocationNullableFilter.schema';
import { LocationSchema } from '../enums/Location.schema';
import { EnumDocumentTypeFilterObjectSchema } from './EnumDocumentTypeFilter.schema';
import { DocumentTypeSchema } from '../enums/DocumentType.schema';
import { JsonNullableFilterObjectSchema } from './JsonNullableFilter.schema';
import { IntNullableFilterObjectSchema } from './IntNullableFilter.schema';
import { DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema';
import { FeedRelationFilterObjectSchema } from './FeedRelationFilter.schema';
import { FeedWhereInputObjectSchema } from './FeedWhereInput.schema';
import { InteractionListRelationFilterObjectSchema } from './InteractionListRelationFilter.schema';
import { EntryMediaListRelationFilterObjectSchema } from './EntryMediaListRelationFilter.schema';
import { AnnotationListRelationFilterObjectSchema } from './AnnotationListRelationFilter.schema';
import { BookmarkListRelationFilterObjectSchema } from './BookmarkListRelationFilter.schema';
import { TagListRelationFilterObjectSchema } from './TagListRelationFilter.schema';
import { EntryTagListRelationFilterObjectSchema } from './EntryTagListRelationFilter.schema';
import { ContextListRelationFilterObjectSchema } from './ContextListRelationFilter.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryWhereUniqueInput> = z
	.object({
		id: z.number().optional(),
		uri: z.string().optional(),
		guid: z.string().optional(),
		uri_id: z.lazy(() => EntryUriIdCompoundUniqueInputObjectSchema).optional(),
		AND: z
			.union([
				z.lazy(() => EntryWhereInputObjectSchema),
				z.lazy(() => EntryWhereInputObjectSchema).array(),
			])
			.optional(),
		OR: z
			.lazy(() => EntryWhereInputObjectSchema)
			.array()
			.optional(),
		NOT: z
			.union([
				z.lazy(() => EntryWhereInputObjectSchema),
				z.lazy(() => EntryWhereInputObjectSchema).array(),
			])
			.optional(),
		data: z.lazy(() => EntryDataListRelationFilterObjectSchema).optional(),
		createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
		author: z
			.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()])
			.optional()
			.nullable(),
		location: z
			.union([z.lazy(() => EnumLocationNullableFilterObjectSchema), z.lazy(() => LocationSchema)])
			.optional()
			.nullable(),
		title: z
			.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()])
			.optional()
			.nullable(),
		type: z
			.union([z.lazy(() => EnumDocumentTypeFilterObjectSchema), z.lazy(() => DocumentTypeSchema)])
			.optional(),
		updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
		html: z
			.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()])
			.optional()
			.nullable(),
		text: z
			.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()])
			.optional()
			.nullable(),
		image: z
			.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()])
			.optional()
			.nullable(),
		original: z.lazy(() => JsonNullableFilterObjectSchema).optional(),
		wordCount: z
			.union([z.lazy(() => IntNullableFilterObjectSchema), z.number()])
			.optional()
			.nullable(),
		siteName: z
			.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()])
			.optional()
			.nullable(),
		summary: z
			.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()])
			.optional()
			.nullable(),
		media: z.lazy(() => JsonNullableFilterObjectSchema).optional(),
		published: z
			.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.date()])
			.optional()
			.nullable(),
		updated: z
			.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.date()])
			.optional()
			.nullable(),
		feedId: z
			.union([z.lazy(() => IntNullableFilterObjectSchema), z.number()])
			.optional()
			.nullable(),
		feed: z
			.union([
				z.lazy(() => FeedRelationFilterObjectSchema),
				z.lazy(() => FeedWhereInputObjectSchema),
			])
			.optional()
			.nullable(),
		interactions: z.lazy(() => InteractionListRelationFilterObjectSchema).optional(),
		EntryMedia: z.lazy(() => EntryMediaListRelationFilterObjectSchema).optional(),
		annotations: z.lazy(() => AnnotationListRelationFilterObjectSchema).optional(),
		bookmarks: z.lazy(() => BookmarkListRelationFilterObjectSchema).optional(),
		tags: z.lazy(() => TagListRelationFilterObjectSchema).optional(),
		entrytags: z.lazy(() => EntryTagListRelationFilterObjectSchema).optional(),
		context: z.lazy(() => ContextListRelationFilterObjectSchema).optional(),
	})
	.strict();

export const EntryWhereUniqueInputObjectSchema = Schema;
