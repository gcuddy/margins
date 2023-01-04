import { z } from 'zod';
import { LocationSchema } from '../enums/Location.schema';
import { EnumLocationFieldRefInputObjectSchema } from './EnumLocationFieldRefInput.schema';
import { NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumLocationFilterObjectSchema } from './NestedEnumLocationFilter.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.NestedEnumLocationWithAggregatesFilter> = z
	.object({
		equals: z
			.union([z.lazy(() => LocationSchema), z.lazy(() => EnumLocationFieldRefInputObjectSchema)])
			.optional(),
		in: z
			.lazy(() => LocationSchema)
			.array()
			.optional(),
		notIn: z
			.lazy(() => LocationSchema)
			.array()
			.optional(),
		not: z
			.union([
				z.lazy(() => LocationSchema),
				z.lazy(() => NestedEnumLocationWithAggregatesFilterObjectSchema),
			])
			.optional(),
		_count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
		_min: z.lazy(() => NestedEnumLocationFilterObjectSchema).optional(),
		_max: z.lazy(() => NestedEnumLocationFilterObjectSchema).optional(),
	})
	.strict();

export const NestedEnumLocationWithAggregatesFilterObjectSchema = Schema;
