import { z } from 'zod';
import { IntFieldUpdateOperationsInputObjectSchema } from './IntFieldUpdateOperationsInput.schema';
import { CollectionItemTypeSchema } from '../enums/CollectionItemType.schema';
import { EnumCollectionItemTypeFieldUpdateOperationsInputObjectSchema } from './EnumCollectionItemTypeFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { AnnotationUpdateOneWithoutCollectionsNestedInputObjectSchema } from './AnnotationUpdateOneWithoutCollectionsNestedInput.schema';
import { BookmarkUpdateOneWithoutCollectionsNestedInputObjectSchema } from './BookmarkUpdateOneWithoutCollectionsNestedInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.CollectionItemsUpdateWithoutCollectionInput> = z
	.object({
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
		bookmark: z.lazy(() => BookmarkUpdateOneWithoutCollectionsNestedInputObjectSchema).optional(),
	})
	.strict();

export const CollectionItemsUpdateWithoutCollectionInputObjectSchema = Schema;
