import { z } from 'zod';
import { FloatFieldRefInputObjectSchema } from './FloatFieldRefInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.NestedFloatNullableFilter> = z
	.object({
		equals: z
			.union([z.number(), z.lazy(() => FloatFieldRefInputObjectSchema)])
			.optional()
			.nullable(),
		in: z.number().array().optional().nullable(),
		notIn: z.number().array().optional().nullable(),
		lt: z.union([z.number(), z.lazy(() => FloatFieldRefInputObjectSchema)]).optional(),
		lte: z.union([z.number(), z.lazy(() => FloatFieldRefInputObjectSchema)]).optional(),
		gt: z.union([z.number(), z.lazy(() => FloatFieldRefInputObjectSchema)]).optional(),
		gte: z.union([z.number(), z.lazy(() => FloatFieldRefInputObjectSchema)]).optional(),
		not: z
			.union([z.number(), z.lazy(() => NestedFloatNullableFilterObjectSchema)])
			.optional()
			.nullable(),
	})
	.strict();

export const NestedFloatNullableFilterObjectSchema = Schema;
