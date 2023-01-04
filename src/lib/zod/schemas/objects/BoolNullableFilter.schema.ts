import { z } from 'zod';
import { BooleanFieldRefInputObjectSchema } from './BooleanFieldRefInput.schema';
import { NestedBoolNullableFilterObjectSchema } from './NestedBoolNullableFilter.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.BoolNullableFilter> = z
	.object({
		equals: z
			.union([z.boolean(), z.lazy(() => BooleanFieldRefInputObjectSchema)])
			.optional()
			.nullable(),
		not: z
			.union([z.boolean(), z.lazy(() => NestedBoolNullableFilterObjectSchema)])
			.optional()
			.nullable(),
	})
	.strict();

export const BoolNullableFilterObjectSchema = Schema;
