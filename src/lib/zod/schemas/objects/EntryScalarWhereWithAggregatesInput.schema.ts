import { z } from 'zod';
import { DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema';
import { StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { EnumLocationNullableWithAggregatesFilterObjectSchema } from './EnumLocationNullableWithAggregatesFilter.schema';
import { LocationSchema } from '../enums/Location.schema';
import { EnumDocumentTypeWithAggregatesFilterObjectSchema } from './EnumDocumentTypeWithAggregatesFilter.schema';
import { DocumentTypeSchema } from '../enums/DocumentType.schema';
import { IntWithAggregatesFilterObjectSchema } from './IntWithAggregatesFilter.schema';
import { JsonNullableWithAggregatesFilterObjectSchema } from './JsonNullableWithAggregatesFilter.schema';
import { IntNullableWithAggregatesFilterObjectSchema } from './IntNullableWithAggregatesFilter.schema';
import { DateTimeNullableWithAggregatesFilterObjectSchema } from './DateTimeNullableWithAggregatesFilter.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryScalarWhereWithAggregatesInput> = z
	.object({
		AND: z
			.union([
				z.lazy(() => EntryScalarWhereWithAggregatesInputObjectSchema),
				z.lazy(() => EntryScalarWhereWithAggregatesInputObjectSchema).array(),
			])
			.optional(),
		OR: z
			.lazy(() => EntryScalarWhereWithAggregatesInputObjectSchema)
			.array()
			.optional(),
		NOT: z
			.union([
				z.lazy(() => EntryScalarWhereWithAggregatesInputObjectSchema),
				z.lazy(() => EntryScalarWhereWithAggregatesInputObjectSchema).array(),
			])
			.optional(),
		createdAt: z
			.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.date()])
			.optional(),
		author: z
			.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()])
			.optional()
			.nullable(),
		location: z
			.union([
				z.lazy(() => EnumLocationNullableWithAggregatesFilterObjectSchema),
				z.lazy(() => LocationSchema),
			])
			.optional()
			.nullable(),
		title: z
			.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()])
			.optional()
			.nullable(),
		type: z
			.union([
				z.lazy(() => EnumDocumentTypeWithAggregatesFilterObjectSchema),
				z.lazy(() => DocumentTypeSchema),
			])
			.optional(),
		updatedAt: z
			.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.date()])
			.optional(),
		id: z.union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number()]).optional(),
		uri: z
			.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()])
			.optional()
			.nullable(),
		html: z
			.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()])
			.optional()
			.nullable(),
		text: z
			.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()])
			.optional()
			.nullable(),
		image: z
			.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()])
			.optional()
			.nullable(),
		guid: z
			.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()])
			.optional()
			.nullable(),
		original: z.lazy(() => JsonNullableWithAggregatesFilterObjectSchema).optional(),
		wordCount: z
			.union([z.lazy(() => IntNullableWithAggregatesFilterObjectSchema), z.number()])
			.optional()
			.nullable(),
		siteName: z
			.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()])
			.optional()
			.nullable(),
		summary: z
			.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()])
			.optional()
			.nullable(),
		media: z.lazy(() => JsonNullableWithAggregatesFilterObjectSchema).optional(),
		published: z
			.union([z.lazy(() => DateTimeNullableWithAggregatesFilterObjectSchema), z.date()])
			.optional()
			.nullable(),
		updated: z
			.union([z.lazy(() => DateTimeNullableWithAggregatesFilterObjectSchema), z.date()])
			.optional()
			.nullable(),
		feedId: z
			.union([z.lazy(() => IntNullableWithAggregatesFilterObjectSchema), z.number()])
			.optional()
			.nullable(),
	})
	.strict();

export const EntryScalarWhereWithAggregatesInputObjectSchema = Schema;
