import { z } from 'zod';
import { DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema';
import { EntryUpdateOneWithoutBookmarksNestedInputObjectSchema } from './EntryUpdateOneWithoutBookmarksNestedInput.schema';
import { UserUpdateOneRequiredWithoutBookmarksNestedInputObjectSchema } from './UserUpdateOneRequiredWithoutBookmarksNestedInput.schema';
import { NullableIntFieldUpdateOperationsInputObjectSchema } from './NullableIntFieldUpdateOperationsInput.schema';
import { BoolFieldUpdateOperationsInputObjectSchema } from './BoolFieldUpdateOperationsInput.schema';
import { FloatFieldUpdateOperationsInputObjectSchema } from './FloatFieldUpdateOperationsInput.schema';
import { StateUpdateOneWithoutBookmarksNestedInputObjectSchema } from './StateUpdateOneWithoutBookmarksNestedInput.schema';
import { TaggingUpdateManyWithoutBookmarkNestedInputObjectSchema } from './TaggingUpdateManyWithoutBookmarkNestedInput.schema';
import { CollectionItemsUpdateManyWithoutBookmarkNestedInputObjectSchema } from './CollectionItemsUpdateManyWithoutBookmarkNestedInput.schema';
import { InteractionUpdateOneWithoutBookmarkNestedInputObjectSchema } from './InteractionUpdateOneWithoutBookmarkNestedInput.schema';
import { FavoriteUpdateOneWithoutBookmarkNestedInputObjectSchema } from './FavoriteUpdateOneWithoutBookmarkNestedInput.schema';
import { AnnotationUpdateManyWithoutBookmarkNestedInputObjectSchema } from './AnnotationUpdateManyWithoutBookmarkNestedInput.schema';
import { NullableDateTimeFieldUpdateOperationsInputObjectSchema } from './NullableDateTimeFieldUpdateOperationsInput.schema';

import type { Prisma } from '@prisma/client';

const literalSchema = z.union([z.string(), z.number(), z.boolean()]);
const jsonSchema: z.ZodType<Prisma.InputJsonValue> = z.lazy(() =>
	z.union([literalSchema, z.array(jsonSchema.nullable()), z.record(jsonSchema.nullable())])
);

const Schema: z.ZodType<Prisma.BookmarkUpdateInput> = z
	.object({
		createdAt: z
			.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)])
			.optional(),
		updatedAt: z
			.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)])
			.optional(),
		context: z.union([z.lazy(() => NullableJsonNullValueInputSchema), jsonSchema]).optional(),
		entry: z.lazy(() => EntryUpdateOneWithoutBookmarksNestedInputObjectSchema).optional(),
		user: z.lazy(() => UserUpdateOneRequiredWithoutBookmarksNestedInputObjectSchema).optional(),
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
		state: z.lazy(() => StateUpdateOneWithoutBookmarksNestedInputObjectSchema).optional(),
		private: z
			.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema)])
			.optional(),
		tags: z.lazy(() => TaggingUpdateManyWithoutBookmarkNestedInputObjectSchema).optional(),
		collections: z
			.lazy(() => CollectionItemsUpdateManyWithoutBookmarkNestedInputObjectSchema)
			.optional(),
		interaction: z
			.lazy(() => InteractionUpdateOneWithoutBookmarkNestedInputObjectSchema)
			.optional(),
		favorite: z.lazy(() => FavoriteUpdateOneWithoutBookmarkNestedInputObjectSchema).optional(),
		favoriteId: z
			.union([z.number(), z.lazy(() => NullableIntFieldUpdateOperationsInputObjectSchema)])
			.optional()
			.nullable(),
		annotations: z
			.lazy(() => AnnotationUpdateManyWithoutBookmarkNestedInputObjectSchema)
			.optional(),
		deleted: z
			.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)])
			.optional()
			.nullable(),
	})
	.strict();

export const BookmarkUpdateInputObjectSchema = Schema;
