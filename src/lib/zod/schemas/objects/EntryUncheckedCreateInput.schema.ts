import { z } from 'zod';
import { EntryDataUncheckedCreateNestedManyWithoutEntryInputObjectSchema } from './EntryDataUncheckedCreateNestedManyWithoutEntryInput.schema';
import { LocationSchema } from '../enums/Location.schema';
import { DocumentTypeSchema } from '../enums/DocumentType.schema';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema';
import { InteractionUncheckedCreateNestedManyWithoutEntryInputObjectSchema } from './InteractionUncheckedCreateNestedManyWithoutEntryInput.schema';
import { EntryMediaUncheckedCreateNestedManyWithoutEntryInputObjectSchema } from './EntryMediaUncheckedCreateNestedManyWithoutEntryInput.schema';
import { AnnotationUncheckedCreateNestedManyWithoutEntryInputObjectSchema } from './AnnotationUncheckedCreateNestedManyWithoutEntryInput.schema';
import { BookmarkUncheckedCreateNestedManyWithoutEntryInputObjectSchema } from './BookmarkUncheckedCreateNestedManyWithoutEntryInput.schema';
import { TagUncheckedCreateNestedManyWithoutEntriesInputObjectSchema } from './TagUncheckedCreateNestedManyWithoutEntriesInput.schema';
import { EntryTagUncheckedCreateNestedManyWithoutEntryInputObjectSchema } from './EntryTagUncheckedCreateNestedManyWithoutEntryInput.schema';
import { ContextUncheckedCreateNestedManyWithoutEntryInputObjectSchema } from './ContextUncheckedCreateNestedManyWithoutEntryInput.schema';

import type { Prisma } from '@prisma/client';

const literalSchema = z.union([z.string(), z.number(), z.boolean()]);
const jsonSchema: z.ZodType<Prisma.InputJsonValue> = z.lazy(() =>
	z.union([literalSchema, z.array(jsonSchema.nullable()), z.record(jsonSchema.nullable())])
);

const Schema: z.ZodType<Prisma.EntryUncheckedCreateInput> = z
	.object({
		data: z.lazy(() => EntryDataUncheckedCreateNestedManyWithoutEntryInputObjectSchema).optional(),
		createdAt: z.date().optional(),
		author: z.string().optional().nullable(),
		location: z
			.lazy(() => LocationSchema)
			.optional()
			.nullable(),
		title: z.string().optional().nullable(),
		type: z.lazy(() => DocumentTypeSchema).optional(),
		updatedAt: z.date().optional(),
		id: z.number().optional(),
		uri: z.string().optional().nullable(),
		html: z.string().optional().nullable(),
		text: z.string().optional().nullable(),
		image: z.string().optional().nullable(),
		guid: z.string().optional().nullable(),
		original: z.union([z.lazy(() => NullableJsonNullValueInputSchema), jsonSchema]).optional(),
		wordCount: z.number().optional().nullable(),
		siteName: z.string().optional().nullable(),
		summary: z.string().optional().nullable(),
		media: z.union([z.lazy(() => NullableJsonNullValueInputSchema), jsonSchema]).optional(),
		published: z.date().optional().nullable(),
		updated: z.date().optional().nullable(),
		feedId: z.number().optional().nullable(),
		interactions: z
			.lazy(() => InteractionUncheckedCreateNestedManyWithoutEntryInputObjectSchema)
			.optional(),
		EntryMedia: z
			.lazy(() => EntryMediaUncheckedCreateNestedManyWithoutEntryInputObjectSchema)
			.optional(),
		annotations: z
			.lazy(() => AnnotationUncheckedCreateNestedManyWithoutEntryInputObjectSchema)
			.optional(),
		bookmarks: z
			.lazy(() => BookmarkUncheckedCreateNestedManyWithoutEntryInputObjectSchema)
			.optional(),
		tags: z.lazy(() => TagUncheckedCreateNestedManyWithoutEntriesInputObjectSchema).optional(),
		entrytags: z
			.lazy(() => EntryTagUncheckedCreateNestedManyWithoutEntryInputObjectSchema)
			.optional(),
		context: z.lazy(() => ContextUncheckedCreateNestedManyWithoutEntryInputObjectSchema).optional(),
	})
	.strict();

export const EntryUncheckedCreateInputObjectSchema = Schema;
