import { z } from 'zod';
import { BooleanFieldRefInputObjectSchema } from './BooleanFieldRefInput.schema';
import { NestedIntNullableFilterObjectSchema } from './NestedIntNullableFilter.schema';
import { NestedBoolNullableFilterObjectSchema } from './NestedBoolNullableFilter.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.NestedBoolNullableWithAggregatesFilter> = z
	.object({
		equals: z
			.union([z.boolean(), z.lazy(() => BooleanFieldRefInputObjectSchema)])
			.optional()
			.nullable(),
		not: z
			.union([z.boolean(), z.lazy(() => NestedBoolNullableWithAggregatesFilterObjectSchema)])
			.optional()
			.nullable(),
		_count: z.lazy(() => NestedIntNullableFilterObjectSchema).optional(),
		_min: z.lazy(() => NestedBoolNullableFilterObjectSchema).optional(),
		_max: z.lazy(() => NestedBoolNullableFilterObjectSchema).optional(),
	})
	.strict();

export const NestedBoolNullableWithAggregatesFilterObjectSchema = Schema;
