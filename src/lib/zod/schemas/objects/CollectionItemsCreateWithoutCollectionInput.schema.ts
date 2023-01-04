import { z } from 'zod';
import { CollectionItemTypeSchema } from '../enums/CollectionItemType.schema';
import { AnnotationCreateNestedOneWithoutCollectionsInputObjectSchema } from './AnnotationCreateNestedOneWithoutCollectionsInput.schema';
import { BookmarkCreateNestedOneWithoutCollectionsInputObjectSchema } from './BookmarkCreateNestedOneWithoutCollectionsInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.CollectionItemsCreateWithoutCollectionInput> = z
	.object({
		position: z.number().optional(),
		type: z.lazy(() => CollectionItemTypeSchema),
		createdAt: z.date().optional(),
		updatedAt: z.date().optional(),
		annotation: z
			.lazy(() => AnnotationCreateNestedOneWithoutCollectionsInputObjectSchema)
			.optional(),
		bookmark: z.lazy(() => BookmarkCreateNestedOneWithoutCollectionsInputObjectSchema).optional(),
	})
	.strict();

export const CollectionItemsCreateWithoutCollectionInputObjectSchema = Schema;
