import { z } from 'zod';
import { DateTimeFieldRefInputObjectSchema } from './DateTimeFieldRefInput.schema';
import { NestedDateTimeWithAggregatesFilterObjectSchema } from './NestedDateTimeWithAggregatesFilter.schema';
import { NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedDateTimeFilterObjectSchema } from './NestedDateTimeFilter.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.DateTimeWithAggregatesFilter> = z
	.object({
		equals: z.union([z.date(), z.lazy(() => DateTimeFieldRefInputObjectSchema)]).optional(),
		in: z.date().array().optional(),
		notIn: z.date().array().optional(),
		lt: z.union([z.date(), z.lazy(() => DateTimeFieldRefInputObjectSchema)]).optional(),
		lte: z.union([z.date(), z.lazy(() => DateTimeFieldRefInputObjectSchema)]).optional(),
		gt: z.union([z.date(), z.lazy(() => DateTimeFieldRefInputObjectSchema)]).optional(),
		gte: z.union([z.date(), z.lazy(() => DateTimeFieldRefInputObjectSchema)]).optional(),
		not: z
			.union([z.date(), z.lazy(() => NestedDateTimeWithAggregatesFilterObjectSchema)])
			.optional(),
		_count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
		_min: z.lazy(() => NestedDateTimeFilterObjectSchema).optional(),
		_max: z.lazy(() => NestedDateTimeFilterObjectSchema).optional(),
	})
	.strict();

export const DateTimeWithAggregatesFilterObjectSchema = Schema;
