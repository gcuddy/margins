import { z } from 'zod';
import { CollectionItemsWhereInputObjectSchema } from './CollectionItemsWhereInput.schema';
import { CollectionRelationFilterObjectSchema } from './CollectionRelationFilter.schema';
import { CollectionWhereInputObjectSchema } from './CollectionWhereInput.schema';
import { IntFilterObjectSchema } from './IntFilter.schema';
import { EnumCollectionItemTypeFilterObjectSchema } from './EnumCollectionItemTypeFilter.schema';
import { CollectionItemTypeSchema } from '../enums/CollectionItemType.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { AnnotationRelationFilterObjectSchema } from './AnnotationRelationFilter.schema';
import { AnnotationWhereInputObjectSchema } from './AnnotationWhereInput.schema';
import { BookmarkRelationFilterObjectSchema } from './BookmarkRelationFilter.schema';
import { BookmarkWhereInputObjectSchema } from './BookmarkWhereInput.schema';
import { IntNullableFilterObjectSchema } from './IntNullableFilter.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.CollectionItemsWhereUniqueInput> = z
	.object({
		id: z.number().optional(),
		annotationId: z.number().optional(),
		AND: z
			.union([
				z.lazy(() => CollectionItemsWhereInputObjectSchema),
				z.lazy(() => CollectionItemsWhereInputObjectSchema).array(),
			])
			.optional(),
		OR: z
			.lazy(() => CollectionItemsWhereInputObjectSchema)
			.array()
			.optional(),
		NOT: z
			.union([
				z.lazy(() => CollectionItemsWhereInputObjectSchema),
				z.lazy(() => CollectionItemsWhereInputObjectSchema).array(),
			])
			.optional(),
		collection: z
			.union([
				z.lazy(() => CollectionRelationFilterObjectSchema),
				z.lazy(() => CollectionWhereInputObjectSchema),
			])
			.optional(),
		collectionId: z.union([z.lazy(() => IntFilterObjectSchema), z.number()]).optional(),
		position: z.union([z.lazy(() => IntFilterObjectSchema), z.number()]).optional(),
		type: z
			.union([
				z.lazy(() => EnumCollectionItemTypeFilterObjectSchema),
				z.lazy(() => CollectionItemTypeSchema),
			])
			.optional(),
		createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
		updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
		annotation: z
			.union([
				z.lazy(() => AnnotationRelationFilterObjectSchema),
				z.lazy(() => AnnotationWhereInputObjectSchema),
			])
			.optional()
			.nullable(),
		bookmark: z
			.union([
				z.lazy(() => BookmarkRelationFilterObjectSchema),
				z.lazy(() => BookmarkWhereInputObjectSchema),
			])
			.optional()
			.nullable(),
		bookmarkId: z
			.union([z.lazy(() => IntNullableFilterObjectSchema), z.number()])
			.optional()
			.nullable(),
	})
	.strict();

export const CollectionItemsWhereUniqueInputObjectSchema = Schema;
