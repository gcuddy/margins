import { z } from 'zod';
import { IntWithAggregatesFilterObjectSchema } from './IntWithAggregatesFilter.schema';
import { EnumCollectionItemTypeWithAggregatesFilterObjectSchema } from './EnumCollectionItemTypeWithAggregatesFilter.schema';
import { CollectionItemTypeSchema } from '../enums/CollectionItemType.schema';
import { DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema';
import { IntNullableWithAggregatesFilterObjectSchema } from './IntNullableWithAggregatesFilter.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.CollectionItemsScalarWhereWithAggregatesInput> = z
	.object({
		AND: z
			.union([
				z.lazy(() => CollectionItemsScalarWhereWithAggregatesInputObjectSchema),
				z.lazy(() => CollectionItemsScalarWhereWithAggregatesInputObjectSchema).array(),
			])
			.optional(),
		OR: z
			.lazy(() => CollectionItemsScalarWhereWithAggregatesInputObjectSchema)
			.array()
			.optional(),
		NOT: z
			.union([
				z.lazy(() => CollectionItemsScalarWhereWithAggregatesInputObjectSchema),
				z.lazy(() => CollectionItemsScalarWhereWithAggregatesInputObjectSchema).array(),
			])
			.optional(),
		id: z.union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number()]).optional(),
		collectionId: z
			.union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number()])
			.optional(),
		position: z.union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number()]).optional(),
		type: z
			.union([
				z.lazy(() => EnumCollectionItemTypeWithAggregatesFilterObjectSchema),
				z.lazy(() => CollectionItemTypeSchema),
			])
			.optional(),
		createdAt: z
			.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.date()])
			.optional(),
		updatedAt: z
			.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.date()])
			.optional(),
		annotationId: z
			.union([z.lazy(() => IntNullableWithAggregatesFilterObjectSchema), z.number()])
			.optional()
			.nullable(),
		bookmarkId: z
			.union([z.lazy(() => IntNullableWithAggregatesFilterObjectSchema), z.number()])
			.optional()
			.nullable(),
	})
	.strict();

export const CollectionItemsScalarWhereWithAggregatesInputObjectSchema = Schema;
