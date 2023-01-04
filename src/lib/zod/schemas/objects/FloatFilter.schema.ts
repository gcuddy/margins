import { z } from 'zod';
import { FloatFieldRefInputObjectSchema } from './FloatFieldRefInput.schema';
import { NestedFloatFilterObjectSchema } from './NestedFloatFilter.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FloatFilter> = z
	.object({
		equals: z.union([z.number(), z.lazy(() => FloatFieldRefInputObjectSchema)]).optional(),
		in: z.number().array().optional(),
		notIn: z.number().array().optional(),
		lt: z.union([z.number(), z.lazy(() => FloatFieldRefInputObjectSchema)]).optional(),
		lte: z.union([z.number(), z.lazy(() => FloatFieldRefInputObjectSchema)]).optional(),
		gt: z.union([z.number(), z.lazy(() => FloatFieldRefInputObjectSchema)]).optional(),
		gte: z.union([z.number(), z.lazy(() => FloatFieldRefInputObjectSchema)]).optional(),
		not: z.union([z.number(), z.lazy(() => NestedFloatFilterObjectSchema)]).optional(),
	})
	.strict();

export const FloatFilterObjectSchema = Schema;
