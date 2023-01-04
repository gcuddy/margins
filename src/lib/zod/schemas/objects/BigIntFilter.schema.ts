import { z } from 'zod';
import { BigIntFieldRefInputObjectSchema } from './BigIntFieldRefInput.schema';
import { NestedBigIntFilterObjectSchema } from './NestedBigIntFilter.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.BigIntFilter> = z
	.object({
		equals: z.union([z.bigint(), z.lazy(() => BigIntFieldRefInputObjectSchema)]).optional(),
		in: z.bigint().array().optional(),
		notIn: z.bigint().array().optional(),
		lt: z.union([z.bigint(), z.lazy(() => BigIntFieldRefInputObjectSchema)]).optional(),
		lte: z.union([z.bigint(), z.lazy(() => BigIntFieldRefInputObjectSchema)]).optional(),
		gt: z.union([z.bigint(), z.lazy(() => BigIntFieldRefInputObjectSchema)]).optional(),
		gte: z.union([z.bigint(), z.lazy(() => BigIntFieldRefInputObjectSchema)]).optional(),
		not: z.union([z.bigint(), z.lazy(() => NestedBigIntFilterObjectSchema)]).optional(),
	})
	.strict();

export const BigIntFilterObjectSchema = Schema;
