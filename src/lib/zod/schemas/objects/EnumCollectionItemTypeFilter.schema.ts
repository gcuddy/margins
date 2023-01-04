import { z } from 'zod';
import { CollectionItemTypeSchema } from '../enums/CollectionItemType.schema';
import { EnumCollectionItemTypeFieldRefInputObjectSchema } from './EnumCollectionItemTypeFieldRefInput.schema';
import { NestedEnumCollectionItemTypeFilterObjectSchema } from './NestedEnumCollectionItemTypeFilter.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EnumCollectionItemTypeFilter> = z
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
				z.lazy(() => NestedEnumCollectionItemTypeFilterObjectSchema),
			])
			.optional(),
	})
	.strict();

export const EnumCollectionItemTypeFilterObjectSchema = Schema;
