import { z } from 'zod';
import { DateTimeFieldRefInputObjectSchema } from './DateTimeFieldRefInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.NestedDateTimeFilter> = z
	.object({
		equals: z.union([z.date(), z.lazy(() => DateTimeFieldRefInputObjectSchema)]).optional(),
		in: z.date().array().optional(),
		notIn: z.date().array().optional(),
		lt: z.union([z.date(), z.lazy(() => DateTimeFieldRefInputObjectSchema)]).optional(),
		lte: z.union([z.date(), z.lazy(() => DateTimeFieldRefInputObjectSchema)]).optional(),
		gt: z.union([z.date(), z.lazy(() => DateTimeFieldRefInputObjectSchema)]).optional(),
		gte: z.union([z.date(), z.lazy(() => DateTimeFieldRefInputObjectSchema)]).optional(),
		not: z.union([z.date(), z.lazy(() => NestedDateTimeFilterObjectSchema)]).optional(),
	})
	.strict();

export const NestedDateTimeFilterObjectSchema = Schema;
