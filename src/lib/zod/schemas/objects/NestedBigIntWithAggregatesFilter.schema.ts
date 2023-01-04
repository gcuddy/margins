import { z } from 'zod';
import { BigIntFieldRefInputObjectSchema } from './BigIntFieldRefInput.schema';
import { NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedFloatFilterObjectSchema } from './NestedFloatFilter.schema';
import { NestedBigIntFilterObjectSchema } from './NestedBigIntFilter.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.NestedBigIntWithAggregatesFilter> = z
	.object({
		equals: z.union([z.bigint(), z.lazy(() => BigIntFieldRefInputObjectSchema)]).optional(),
		in: z.bigint().array().optional(),
		notIn: z.bigint().array().optional(),
		lt: z.union([z.bigint(), z.lazy(() => BigIntFieldRefInputObjectSchema)]).optional(),
		lte: z.union([z.bigint(), z.lazy(() => BigIntFieldRefInputObjectSchema)]).optional(),
		gt: z.union([z.bigint(), z.lazy(() => BigIntFieldRefInputObjectSchema)]).optional(),
		gte: z.union([z.bigint(), z.lazy(() => BigIntFieldRefInputObjectSchema)]).optional(),
		not: z
			.union([z.bigint(), z.lazy(() => NestedBigIntWithAggregatesFilterObjectSchema)])
			.optional(),
		_count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
		_avg: z.lazy(() => NestedFloatFilterObjectSchema).optional(),
		_sum: z.lazy(() => NestedBigIntFilterObjectSchema).optional(),
		_min: z.lazy(() => NestedBigIntFilterObjectSchema).optional(),
		_max: z.lazy(() => NestedBigIntFilterObjectSchema).optional(),
	})
	.strict();

export const NestedBigIntWithAggregatesFilterObjectSchema = Schema;
