import { z } from 'zod';
import { CollectionCreateNestedOneWithoutItemsInputObjectSchema } from './CollectionCreateNestedOneWithoutItemsInput.schema';
import { CollectionItemTypeSchema } from '../enums/CollectionItemType.schema';
import { AnnotationCreateNestedOneWithoutCollectionsInputObjectSchema } from './AnnotationCreateNestedOneWithoutCollectionsInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.CollectionItemsCreateWithoutBookmarkInput> = z
	.object({
		collection: z.lazy(() => CollectionCreateNestedOneWithoutItemsInputObjectSchema),
		position: z.number().optional(),
		type: z.lazy(() => CollectionItemTypeSchema),
		createdAt: z.date().optional(),
		updatedAt: z.date().optional(),
		annotation: z
			.lazy(() => AnnotationCreateNestedOneWithoutCollectionsInputObjectSchema)
			.optional(),
	})
	.strict();

export const CollectionItemsCreateWithoutBookmarkInputObjectSchema = Schema;
