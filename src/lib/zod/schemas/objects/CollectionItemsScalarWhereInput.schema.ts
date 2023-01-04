import { z } from 'zod';
import { IntFilterObjectSchema } from './IntFilter.schema';
import { EnumCollectionItemTypeFilterObjectSchema } from './EnumCollectionItemTypeFilter.schema';
import { CollectionItemTypeSchema } from '../enums/CollectionItemType.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { IntNullableFilterObjectSchema } from './IntNullableFilter.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.CollectionItemsScalarWhereInput> = z
	.object({
		AND: z
			.union([
				z.lazy(() => CollectionItemsScalarWhereInputObjectSchema),
				z.lazy(() => CollectionItemsScalarWhereInputObjectSchema).array(),
			])
			.optional(),
		OR: z
			.lazy(() => CollectionItemsScalarWhereInputObjectSchema)
			.array()
			.optional(),
		NOT: z
			.union([
				z.lazy(() => CollectionItemsScalarWhereInputObjectSchema),
				z.lazy(() => CollectionItemsScalarWhereInputObjectSchema).array(),
			])
			.optional(),
		id: z.union([z.lazy(() => IntFilterObjectSchema), z.number()]).optional(),
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
		annotationId: z
			.union([z.lazy(() => IntNullableFilterObjectSchema), z.number()])
			.optional()
			.nullable(),
		bookmarkId: z
			.union([z.lazy(() => IntNullableFilterObjectSchema), z.number()])
			.optional()
			.nullable(),
	})
	.strict();

export const CollectionItemsScalarWhereInputObjectSchema = Schema;
