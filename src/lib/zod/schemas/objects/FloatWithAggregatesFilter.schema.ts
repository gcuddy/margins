import { z } from 'zod';
import { FloatFieldRefInputObjectSchema } from './FloatFieldRefInput.schema';
import { NestedFloatWithAggregatesFilterObjectSchema } from './NestedFloatWithAggregatesFilter.schema';
import { NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedFloatFilterObjectSchema } from './NestedFloatFilter.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FloatWithAggregatesFilter> = z
	.object({
		equals: z.union([z.number(), z.lazy(() => FloatFieldRefInputObjectSchema)]).optional(),
		in: z.number().array().optional(),
		notIn: z.number().array().optional(),
		lt: z.union([z.number(), z.lazy(() => FloatFieldRefInputObjectSchema)]).optional(),
		lte: z.union([z.number(), z.lazy(() => FloatFieldRefInputObjectSchema)]).optional(),
		gt: z.union([z.number(), z.lazy(() => FloatFieldRefInputObjectSchema)]).optional(),
		gte: z.union([z.number(), z.lazy(() => FloatFieldRefInputObjectSchema)]).optional(),
		not: z
			.union([z.number(), z.lazy(() => NestedFloatWithAggregatesFilterObjectSchema)])
			.optional(),
		_count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
		_avg: z.lazy(() => NestedFloatFilterObjectSchema).optional(),
		_sum: z.lazy(() => NestedFloatFilterObjectSchema).optional(),
		_min: z.lazy(() => NestedFloatFilterObjectSchema).optional(),
		_max: z.lazy(() => NestedFloatFilterObjectSchema).optional(),
	})
	.strict();

export const FloatWithAggregatesFilterObjectSchema = Schema;
