import { z } from 'zod';
import { CollectionItemTypeSchema } from '../enums/CollectionItemType.schema';
import { EnumCollectionItemTypeFieldRefInputObjectSchema } from './EnumCollectionItemTypeFieldRefInput.schema';
import { NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumCollectionItemTypeFilterObjectSchema } from './NestedEnumCollectionItemTypeFilter.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.NestedEnumCollectionItemTypeWithAggregatesFilter> = z
	.object({
		equals: z
			.union([
				z.lazy(() => CollectionItemTypeSchema),
				z.lazy(() => EnumCollectionItemTypeFieldRefInputObjectSchema),
			])
			.optional(),
		in: z
			.lazy(() => CollectionItemTypeSchema)
			.array()
			.optional(),
		notIn: z
			.lazy(() => CollectionItemTypeSchema)
			.array()
			.optional(),
		not: z
			.union([
				z.lazy(() => CollectionItemTypeSchema),
				z.lazy(() => NestedEnumCollectionItemTypeWithAggregatesFilterObjectSchema),
			])
			.optional(),
		_count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
		_min: z.lazy(() => NestedEnumCollectionItemTypeFilterObjectSchema).optional(),
		_max: z.lazy(() => NestedEnumCollectionItemTypeFilterObjectSchema).optional(),
	})
	.strict();

export const NestedEnumCollectionItemTypeWithAggregatesFilterObjectSchema = Schema;
