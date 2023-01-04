import { z } from 'zod';
import { CollectionCreateNestedOneWithoutItemsInputObjectSchema } from './CollectionCreateNestedOneWithoutItemsInput.schema';
import { CollectionItemTypeSchema } from '../enums/CollectionItemType.schema';
import { BookmarkCreateNestedOneWithoutCollectionsInputObjectSchema } from './BookmarkCreateNestedOneWithoutCollectionsInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.CollectionItemsCreateWithoutAnnotationInput> = z
	.object({
		collection: z.lazy(() => CollectionCreateNestedOneWithoutItemsInputObjectSchema),
		position: z.number().optional(),
		type: z.lazy(() => CollectionItemTypeSchema),
		createdAt: z.date().optional(),
		updatedAt: z.date().optional(),
		bookmark: z.lazy(() => BookmarkCreateNestedOneWithoutCollectionsInputObjectSchema).optional(),
	})
	.strict();

export const CollectionItemsCreateWithoutAnnotationInputObjectSchema = Schema;
