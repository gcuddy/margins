import { z } from 'zod';
import { LocationSchema } from '../enums/Location.schema';
import { EnumLocationFieldRefInputObjectSchema } from './EnumLocationFieldRefInput.schema';
import { NestedIntNullableFilterObjectSchema } from './NestedIntNullableFilter.schema';
import { NestedEnumLocationNullableFilterObjectSchema } from './NestedEnumLocationNullableFilter.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.NestedEnumLocationNullableWithAggregatesFilter> = z
	.object({
		equals: z
			.union([z.lazy(() => LocationSchema), z.lazy(() => EnumLocationFieldRefInputObjectSchema)])
			.optional()
			.nullable(),
		in: z
			.lazy(() => LocationSchema)
			.array()
			.optional()
			.nullable(),
		notIn: z
			.lazy(() => LocationSchema)
			.array()
			.optional()
			.nullable(),
		not: z
			.union([
				z.lazy(() => LocationSchema),
				z.lazy(() => NestedEnumLocationNullableWithAggregatesFilterObjectSchema),
			])
			.optional()
			.nullable(),
		_count: z.lazy(() => NestedIntNullableFilterObjectSchema).optional(),
		_min: z.lazy(() => NestedEnumLocationNullableFilterObjectSchema).optional(),
		_max: z.lazy(() => NestedEnumLocationNullableFilterObjectSchema).optional(),
	})
	.strict();

export const NestedEnumLocationNullableWithAggregatesFilterObjectSchema = Schema;
