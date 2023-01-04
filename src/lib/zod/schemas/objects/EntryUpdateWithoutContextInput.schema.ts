import { z } from 'zod';
import { EntryDataUpdateManyWithoutEntryNestedInputObjectSchema } from './EntryDataUpdateManyWithoutEntryNestedInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { LocationSchema } from '../enums/Location.schema';
import { NullableEnumLocationFieldUpdateOperationsInputObjectSchema } from './NullableEnumLocationFieldUpdateOperationsInput.schema';
import { DocumentTypeSchema } from '../enums/DocumentType.schema';
import { EnumDocumentTypeFieldUpdateOperationsInputObjectSchema } from './EnumDocumentTypeFieldUpdateOperationsInput.schema';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema';
import { NullableIntFieldUpdateOperationsInputObjectSchema } from './NullableIntFieldUpdateOperationsInput.schema';
import { NullableDateTimeFieldUpdateOperationsInputObjectSchema } from './NullableDateTimeFieldUpdateOperationsInput.schema';
import { FeedUpdateOneWithoutEntriesNestedInputObjectSchema } from './FeedUpdateOneWithoutEntriesNestedInput.schema';
import { InteractionUpdateManyWithoutEntryNestedInputObjectSchema } from './InteractionUpdateManyWithoutEntryNestedInput.schema';
import { EntryMediaUpdateManyWithoutEntryNestedInputObjectSchema } from './EntryMediaUpdateManyWithoutEntryNestedInput.schema';
import { AnnotationUpdateManyWithoutEntryNestedInputObjectSchema } from './AnnotationUpdateManyWithoutEntryNestedInput.schema';
import { BookmarkUpdateManyWithoutEntryNestedInputObjectSchema } from './BookmarkUpdateManyWithoutEntryNestedInput.schema';
import { TagUpdateManyWithoutEntriesNestedInputObjectSchema } from './TagUpdateManyWithoutEntriesNestedInput.schema';
import { EntryTagUpdateManyWithoutEntryNestedInputObjectSchema } from './EntryTagUpdateManyWithoutEntryNestedInput.schema';

import type { Prisma } from '@prisma/client';

const literalSchema = z.union([z.string(), z.number(), z.boolean()]);
const jsonSchema: z.ZodType<Prisma.InputJsonValue> = z.lazy(() =>
	z.union([literalSchema, z.array(jsonSchema.nullable()), z.record(jsonSchema.nullable())])
);

const Schema: z.ZodType<Prisma.EntryUpdateWithoutContextInput> = z
	.object({
		data: z.lazy(() => EntryDataUpdateManyWithoutEntryNestedInputObjectSchema).optional(),
		createdAt: z
			.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)])
			.optional(),
		author: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)])
			.optional()
			.nullable(),
		location: z
			.union([
				z.lazy(() => LocationSchema),
				z.lazy(() => NullableEnumLocationFieldUpdateOperationsInputObjectSchema),
			])
			.optional()
			.nullable(),
		title: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)])
			.optional()
			.nullable(),
		type: z
			.union([
				z.lazy(() => DocumentTypeSchema),
				z.lazy(() => EnumDocumentTypeFieldUpdateOperationsInputObjectSchema),
			])
			.optional(),
		updatedAt: z
			.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)])
			.optional(),
		uri: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)])
			.optional()
			.nullable(),
		html: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)])
			.optional()
			.nullable(),
		text: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)])
			.optional()
			.nullable(),
		image: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)])
			.optional()
			.nullable(),
		guid: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)])
			.optional()
			.nullable(),
		original: z.union([z.lazy(() => NullableJsonNullValueInputSchema), jsonSchema]).optional(),
		wordCount: z
			.union([z.number(), z.lazy(() => NullableIntFieldUpdateOperationsInputObjectSchema)])
			.optional()
			.nullable(),
		siteName: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)])
			.optional()
			.nullable(),
		summary: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)])
			.optional()
			.nullable(),
		media: z.union([z.lazy(() => NullableJsonNullValueInputSchema), jsonSchema]).optional(),
		published: z
			.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)])
			.optional()
			.nullable(),
		updated: z
			.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)])
			.optional()
			.nullable(),
		feed: z.lazy(() => FeedUpdateOneWithoutEntriesNestedInputObjectSchema).optional(),
		interactions: z.lazy(() => InteractionUpdateManyWithoutEntryNestedInputObjectSchema).optional(),
		EntryMedia: z.lazy(() => EntryMediaUpdateManyWithoutEntryNestedInputObjectSchema).optional(),
		annotations: z.lazy(() => AnnotationUpdateManyWithoutEntryNestedInputObjectSchema).optional(),
		bookmarks: z.lazy(() => BookmarkUpdateManyWithoutEntryNestedInputObjectSchema).optional(),
		tags: z.lazy(() => TagUpdateManyWithoutEntriesNestedInputObjectSchema).optional(),
		entrytags: z.lazy(() => EntryTagUpdateManyWithoutEntryNestedInputObjectSchema).optional(),
	})
	.strict();

export const EntryUpdateWithoutContextInputObjectSchema = Schema;
