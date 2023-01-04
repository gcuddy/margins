import { z } from 'zod';
import { IntFieldRefInputObjectSchema } from './IntFieldRefInput.schema';
import { NestedIntWithAggregatesFilterObjectSchema } from './NestedIntWithAggregatesFilter.schema';
import { NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedFloatFilterObjectSchema } from './NestedFloatFilter.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.IntWithAggregatesFilter> = z
	.object({
		equals: z.union([z.number(), z.lazy(() => IntFieldRefInputObjectSchema)]).optional(),
		in: z.number().array().optional(),
		notIn: z.number().array().optional(),
		lt: z.union([z.number(), z.lazy(() => IntFieldRefInputObjectSchema)]).optional(),
		lte: z.union([z.number(), z.lazy(() => IntFieldRefInputObjectSchema)]).optional(),
		gt: z.union([z.number(), z.lazy(() => IntFieldRefInputObjectSchema)]).optional(),
		gte: z.union([z.number(), z.lazy(() => IntFieldRefInputObjectSchema)]).optional(),
		not: z.union([z.number(), z.lazy(() => NestedIntWithAggregatesFilterObjectSchema)]).optional(),
		_count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
		_avg: z.lazy(() => NestedFloatFilterObjectSchema).optional(),
		_sum: z.lazy(() => NestedIntFilterObjectSchema).optional(),
		_min: z.lazy(() => NestedIntFilterObjectSchema).optional(),
		_max: z.lazy(() => NestedIntFilterObjectSchema).optional(),
	})
	.strict();

export const IntWithAggregatesFilterObjectSchema = Schema;
