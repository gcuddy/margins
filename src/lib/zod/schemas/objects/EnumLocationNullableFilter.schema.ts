import { z } from 'zod';
import { LocationSchema } from '../enums/Location.schema';
import { EnumLocationFieldRefInputObjectSchema } from './EnumLocationFieldRefInput.schema';
import { NestedEnumLocationNullableFilterObjectSchema } from './NestedEnumLocationNullableFilter.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EnumLocationNullableFilter> = z
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
				z.lazy(() => NestedEnumLocationNullableFilterObjectSchema),
			])
			.optional()
			.nullable(),
	})
	.strict();

export const EnumLocationNullableFilterObjectSchema = Schema;
