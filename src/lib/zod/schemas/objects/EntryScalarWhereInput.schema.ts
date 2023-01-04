import { z } from 'zod';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { EnumLocationNullableFilterObjectSchema } from './EnumLocationNullableFilter.schema';
import { LocationSchema } from '../enums/Location.schema';
import { EnumDocumentTypeFilterObjectSchema } from './EnumDocumentTypeFilter.schema';
import { DocumentTypeSchema } from '../enums/DocumentType.schema';
import { IntFilterObjectSchema } from './IntFilter.schema';
import { JsonNullableFilterObjectSchema } from './JsonNullableFilter.schema';
import { IntNullableFilterObjectSchema } from './IntNullableFilter.schema';
import { DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryScalarWhereInput> = z
	.object({
		AND: z
			.union([
				z.lazy(() => EntryScalarWhereInputObjectSchema),
				z.lazy(() => EntryScalarWhereInputObjectSchema).array(),
			])
			.optional(),
		OR: z
			.lazy(() => EntryScalarWhereInputObjectSchema)
			.array()
			.optional(),
		NOT: z
			.union([
				z.lazy(() => EntryScalarWhereInputObjectSchema),
				z.lazy(() => EntryScalarWhereInputObjectSchema).array(),
			])
			.optional(),
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
		id: z.union([z.lazy(() => IntFilterObjectSchema), z.number()]).optional(),
		uri: z
			.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()])
			.optional()
			.nullable(),
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
		guid: z
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
	})
	.strict();

export const EntryScalarWhereInputObjectSchema = Schema;
