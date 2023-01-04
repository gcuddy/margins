import { z } from 'zod';
import { LocationSchema } from '../enums/Location.schema';
import { EnumLocationFieldRefInputObjectSchema } from './EnumLocationFieldRefInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.NestedEnumLocationFilter> = z
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
			.union([z.lazy(() => LocationSchema), z.lazy(() => NestedEnumLocationFilterObjectSchema)])
			.optional(),
	})
	.strict();

export const NestedEnumLocationFilterObjectSchema = Schema;
