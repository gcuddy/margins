import { z } from 'zod';
import { DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema';
import { TaggingUpdateManyWithoutAnnotationNestedInputObjectSchema } from './TaggingUpdateManyWithoutAnnotationNestedInput.schema';
import { AnnotationTypeSchema } from '../enums/AnnotationType.schema';
import { EnumAnnotationTypeFieldUpdateOperationsInputObjectSchema } from './EnumAnnotationTypeFieldUpdateOperationsInput.schema';
import { BoolFieldUpdateOperationsInputObjectSchema } from './BoolFieldUpdateOperationsInput.schema';
import { AnnotationUpdateOneWithoutChildrenNestedInputObjectSchema } from './AnnotationUpdateOneWithoutChildrenNestedInput.schema';
import { AnnotationUpdateManyWithoutParentNestedInputObjectSchema } from './AnnotationUpdateManyWithoutParentNestedInput.schema';
import { NullableDateTimeFieldUpdateOperationsInputObjectSchema } from './NullableDateTimeFieldUpdateOperationsInput.schema';
import { UserUpdateOneRequiredWithoutAnnotationsNestedInputObjectSchema } from './UserUpdateOneRequiredWithoutAnnotationsNestedInput.schema';
import { FloatFieldUpdateOperationsInputObjectSchema } from './FloatFieldUpdateOperationsInput.schema';
import { CollectionItemsUpdateOneWithoutAnnotationNestedInputObjectSchema } from './CollectionItemsUpdateOneWithoutAnnotationNestedInput.schema';
import { FavoriteUpdateOneWithoutAnnotationNestedInputObjectSchema } from './FavoriteUpdateOneWithoutAnnotationNestedInput.schema';
import { BookmarkUpdateOneWithoutAnnotationsNestedInputObjectSchema } from './BookmarkUpdateOneWithoutAnnotationsNestedInput.schema';

import type { Prisma } from '@prisma/client';

const literalSchema = z.union([z.string(), z.number(), z.boolean()]);
const jsonSchema: z.ZodType<Prisma.InputJsonValue> = z.lazy(() =>
	z.union([literalSchema, z.array(jsonSchema.nullable()), z.record(jsonSchema.nullable())])
);

const Schema: z.ZodType<Prisma.AnnotationUpdateWithoutEntryInput> = z
	.object({
		createdAt: z
			.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)])
			.optional(),
		updatedAt: z
			.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)])
			.optional(),
		body: z.union([z.lazy(() => NullableJsonNullValueInputSchema), jsonSchema]).optional(),
		tags: z.lazy(() => TaggingUpdateManyWithoutAnnotationNestedInputObjectSchema).optional(),
		type: z
			.union([
				z.lazy(() => AnnotationTypeSchema),
				z.lazy(() => EnumAnnotationTypeFieldUpdateOperationsInputObjectSchema),
			])
			.optional(),
		private: z
			.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema)])
			.optional(),
		target: z.union([z.lazy(() => NullableJsonNullValueInputSchema), jsonSchema]).optional(),
		parent: z.lazy(() => AnnotationUpdateOneWithoutChildrenNestedInputObjectSchema).optional(),
		children: z.lazy(() => AnnotationUpdateManyWithoutParentNestedInputObjectSchema).optional(),
		deleted: z
			.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)])
			.optional()
			.nullable(),
		creator: z
			.lazy(() => UserUpdateOneRequiredWithoutAnnotationsNestedInputObjectSchema)
			.optional(),
		sortOrder: z
			.union([z.number(), z.lazy(() => FloatFieldUpdateOperationsInputObjectSchema)])
			.optional(),
		collections: z
			.lazy(() => CollectionItemsUpdateOneWithoutAnnotationNestedInputObjectSchema)
			.optional(),
		favorite: z.lazy(() => FavoriteUpdateOneWithoutAnnotationNestedInputObjectSchema).optional(),
		bookmark: z.lazy(() => BookmarkUpdateOneWithoutAnnotationsNestedInputObjectSchema).optional(),
	})
	.strict();

export const AnnotationUpdateWithoutEntryInputObjectSchema = Schema;
