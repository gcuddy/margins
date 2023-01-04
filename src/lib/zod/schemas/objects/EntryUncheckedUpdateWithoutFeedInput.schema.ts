import { z } from 'zod';
import { EntryDataUncheckedUpdateManyWithoutEntryNestedInputObjectSchema } from './EntryDataUncheckedUpdateManyWithoutEntryNestedInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { LocationSchema } from '../enums/Location.schema';
import { NullableEnumLocationFieldUpdateOperationsInputObjectSchema } from './NullableEnumLocationFieldUpdateOperationsInput.schema';
import { DocumentTypeSchema } from '../enums/DocumentType.schema';
import { EnumDocumentTypeFieldUpdateOperationsInputObjectSchema } from './EnumDocumentTypeFieldUpdateOperationsInput.schema';
import { IntFieldUpdateOperationsInputObjectSchema } from './IntFieldUpdateOperationsInput.schema';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema';
import { NullableIntFieldUpdateOperationsInputObjectSchema } from './NullableIntFieldUpdateOperationsInput.schema';
import { NullableDateTimeFieldUpdateOperationsInputObjectSchema } from './NullableDateTimeFieldUpdateOperationsInput.schema';
import { InteractionUncheckedUpdateManyWithoutEntryNestedInputObjectSchema } from './InteractionUncheckedUpdateManyWithoutEntryNestedInput.schema';
import { EntryMediaUncheckedUpdateManyWithoutEntryNestedInputObjectSchema } from './EntryMediaUncheckedUpdateManyWithoutEntryNestedInput.schema';
import { AnnotationUncheckedUpdateManyWithoutEntryNestedInputObjectSchema } from './AnnotationUncheckedUpdateManyWithoutEntryNestedInput.schema';
import { BookmarkUncheckedUpdateManyWithoutEntryNestedInputObjectSchema } from './BookmarkUncheckedUpdateManyWithoutEntryNestedInput.schema';
import { TagUncheckedUpdateManyWithoutEntriesNestedInputObjectSchema } from './TagUncheckedUpdateManyWithoutEntriesNestedInput.schema';
import { EntryTagUncheckedUpdateManyWithoutEntryNestedInputObjectSchema } from './EntryTagUncheckedUpdateManyWithoutEntryNestedInput.schema';
import { ContextUncheckedUpdateManyWithoutEntryNestedInputObjectSchema } from './ContextUncheckedUpdateManyWithoutEntryNestedInput.schema';

import type { Prisma } from '@prisma/client';

const literalSchema = z.union([z.string(), z.number(), z.boolean()]);
const jsonSchema: z.ZodType<Prisma.InputJsonValue> = z.lazy(() =>
	z.union([literalSchema, z.array(jsonSchema.nullable()), z.record(jsonSchema.nullable())])
);

const Schema: z.ZodType<Prisma.EntryUncheckedUpdateWithoutFeedInput> = z
	.object({
		data: z.lazy(() => EntryDataUncheckedUpdateManyWithoutEntryNestedInputObjectSchema).optional(),
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
		id: z.union([z.number(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
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
		interactions: z
			.lazy(() => InteractionUncheckedUpdateManyWithoutEntryNestedInputObjectSchema)
			.optional(),
		EntryMedia: z
			.lazy(() => EntryMediaUncheckedUpdateManyWithoutEntryNestedInputObjectSchema)
			.optional(),
		annotations: z
			.lazy(() => AnnotationUncheckedUpdateManyWithoutEntryNestedInputObjectSchema)
			.optional(),
		bookmarks: z
			.lazy(() => BookmarkUncheckedUpdateManyWithoutEntryNestedInputObjectSchema)
			.optional(),
		tags: z.lazy(() => TagUncheckedUpdateManyWithoutEntriesNestedInputObjectSchema).optional(),
		entrytags: z
			.lazy(() => EntryTagUncheckedUpdateManyWithoutEntryNestedInputObjectSchema)
			.optional(),
		context: z.lazy(() => ContextUncheckedUpdateManyWithoutEntryNestedInputObjectSchema).optional(),
	})
	.strict();

export const EntryUncheckedUpdateWithoutFeedInputObjectSchema = Schema;
