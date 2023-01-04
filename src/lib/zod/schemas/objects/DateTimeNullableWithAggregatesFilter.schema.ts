import { z } from 'zod';
import { DateTimeFieldRefInputObjectSchema } from './DateTimeFieldRefInput.schema';
import { NestedDateTimeNullableWithAggregatesFilterObjectSchema } from './NestedDateTimeNullableWithAggregatesFilter.schema';
import { NestedIntNullableFilterObjectSchema } from './NestedIntNullableFilter.schema';
import { NestedDateTimeNullableFilterObjectSchema } from './NestedDateTimeNullableFilter.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.DateTimeNullableWithAggregatesFilter> = z
	.object({
		equals: z
			.union([z.date(), z.lazy(() => DateTimeFieldRefInputObjectSchema)])
			.optional()
			.nullable(),
		in: z.date().array().optional().nullable(),
		notIn: z.date().array().optional().nullable(),
		lt: z.union([z.date(), z.lazy(() => DateTimeFieldRefInputObjectSchema)]).optional(),
		lte: z.union([z.date(), z.lazy(() => DateTimeFieldRefInputObjectSchema)]).optional(),
		gt: z.union([z.date(), z.lazy(() => DateTimeFieldRefInputObjectSchema)]).optional(),
		gte: z.union([z.date(), z.lazy(() => DateTimeFieldRefInputObjectSchema)]).optional(),
		not: z
			.union([z.date(), z.lazy(() => NestedDateTimeNullableWithAggregatesFilterObjectSchema)])
			.optional()
			.nullable(),
		_count: z.lazy(() => NestedIntNullableFilterObjectSchema).optional(),
		_min: z.lazy(() => NestedDateTimeNullableFilterObjectSchema).optional(),
		_max: z.lazy(() => NestedDateTimeNullableFilterObjectSchema).optional(),
	})
	.strict();

export const DateTimeNullableWithAggregatesFilterObjectSchema = Schema;
