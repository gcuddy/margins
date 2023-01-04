import { z } from 'zod';
import { DateTimeFieldRefInputObjectSchema } from './DateTimeFieldRefInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.NestedDateTimeNullableFilter> = z
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
			.union([z.date(), z.lazy(() => NestedDateTimeNullableFilterObjectSchema)])
			.optional()
			.nullable(),
	})
	.strict();

export const NestedDateTimeNullableFilterObjectSchema = Schema;
