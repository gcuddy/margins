import { z } from 'zod';
import { IntFieldUpdateOperationsInputObjectSchema } from './IntFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { NullableIntFieldUpdateOperationsInputObjectSchema } from './NullableIntFieldUpdateOperationsInput.schema';
import { BoolFieldUpdateOperationsInputObjectSchema } from './BoolFieldUpdateOperationsInput.schema';
import { FloatFieldUpdateOperationsInputObjectSchema } from './FloatFieldUpdateOperationsInput.schema';
import { TaggingUncheckedUpdateManyWithoutBookmarkNestedInputObjectSchema } from './TaggingUncheckedUpdateManyWithoutBookmarkNestedInput.schema';
import { CollectionItemsUncheckedUpdateManyWithoutBookmarkNestedInputObjectSchema } from './CollectionItemsUncheckedUpdateManyWithoutBookmarkNestedInput.schema';
import { FavoriteUncheckedUpdateOneWithoutBookmarkNestedInputObjectSchema } from './FavoriteUncheckedUpdateOneWithoutBookmarkNestedInput.schema';
import { AnnotationUncheckedUpdateManyWithoutBookmarkNestedInputObjectSchema } from './AnnotationUncheckedUpdateManyWithoutBookmarkNestedInput.schema';
import { NullableDateTimeFieldUpdateOperationsInputObjectSchema } from './NullableDateTimeFieldUpdateOperationsInput.schema';

import type { Prisma } from '@prisma/client';

const literalSchema = z.union([z.string(), z.number(), z.boolean()]);
const jsonSchema: z.ZodType<Prisma.InputJsonValue> = z.lazy(() =>
	z.union([literalSchema, z.array(jsonSchema.nullable()), z.record(jsonSchema.nullable())])
);

const Schema: z.ZodType<Prisma.BookmarkUncheckedUpdateWithoutEntryInput> = z
	.object({
		id: z.union([z.number(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
		createdAt: z
			.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)])
			.optional(),
		updatedAt: z
			.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)])
			.optional(),
		context: z.union([z.lazy(() => NullableJsonNullValueInputSchema), jsonSchema]).optional(),
		userId: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)])
			.optional(),
		sortOrder: z
			.union([z.number(), z.lazy(() => NullableIntFieldUpdateOperationsInputObjectSchema)])
			.optional()
			.nullable(),
		is_read: z
			.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema)])
			.optional(),
		progress: z
			.union([z.number(), z.lazy(() => FloatFieldUpdateOperationsInputObjectSchema)])
			.optional(),
		data: z.union([z.lazy(() => NullableJsonNullValueInputSchema), jsonSchema]).optional(),
		stateId: z
			.union([z.number(), z.lazy(() => NullableIntFieldUpdateOperationsInputObjectSchema)])
			.optional()
			.nullable(),
		private: z
			.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema)])
			.optional(),
		tags: z.lazy(() => TaggingUncheckedUpdateManyWithoutBookmarkNestedInputObjectSchema).optional(),
		collections: z
			.lazy(() => CollectionItemsUncheckedUpdateManyWithoutBookmarkNestedInputObjectSchema)
			.optional(),
		interactionId: z
			.union([z.number(), z.lazy(() => NullableIntFieldUpdateOperationsInputObjectSchema)])
			.optional()
			.nullable(),
		favorite: z
			.lazy(() => FavoriteUncheckedUpdateOneWithoutBookmarkNestedInputObjectSchema)
			.optional(),
		favoriteId: z
			.union([z.number(), z.lazy(() => NullableIntFieldUpdateOperationsInputObjectSchema)])
			.optional()
			.nullable(),
		annotations: z
			.lazy(() => AnnotationUncheckedUpdateManyWithoutBookmarkNestedInputObjectSchema)
			.optional(),
		deleted: z
			.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)])
			.optional()
			.nullable(),
	})
	.strict();

export const BookmarkUncheckedUpdateWithoutEntryInputObjectSchema = Schema;
