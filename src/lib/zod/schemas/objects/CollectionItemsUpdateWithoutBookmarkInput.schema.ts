import { z } from 'zod';
import { CollectionUpdateOneRequiredWithoutItemsNestedInputObjectSchema } from './CollectionUpdateOneRequiredWithoutItemsNestedInput.schema';
import { IntFieldUpdateOperationsInputObjectSchema } from './IntFieldUpdateOperationsInput.schema';
import { CollectionItemTypeSchema } from '../enums/CollectionItemType.schema';
import { EnumCollectionItemTypeFieldUpdateOperationsInputObjectSchema } from './EnumCollectionItemTypeFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { AnnotationUpdateOneWithoutCollectionsNestedInputObjectSchema } from './AnnotationUpdateOneWithoutCollectionsNestedInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.CollectionItemsUpdateWithoutBookmarkInput> = z
	.object({
		collection: z
			.lazy(() => CollectionUpdateOneRequiredWithoutItemsNestedInputObjectSchema)
			.optional(),
		position: z
			.union([z.number(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)])
			.optional(),
		type: z
			.union([
				z.lazy(() => CollectionItemTypeSchema),
				z.lazy(() => EnumCollectionItemTypeFieldUpdateOperationsInputObjectSchema),
			])
			.optional(),
		createdAt: z
			.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)])
			.optional(),
		updatedAt: z
			.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)])
			.optional(),
		annotation: z
			.lazy(() => AnnotationUpdateOneWithoutCollectionsNestedInputObjectSchema)
			.optional(),
	})
	.strict();

export const CollectionItemsUpdateWithoutBookmarkInputObjectSchema = Schema;
