import { z } from 'zod';
import { IntFieldRefInputObjectSchema } from './IntFieldRefInput.schema';
import { NestedIntNullableFilterObjectSchema } from './NestedIntNullableFilter.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.IntNullableFilter> = z
	.object({
		equals: z
			.union([z.number(), z.lazy(() => IntFieldRefInputObjectSchema)])
			.optional()
			.nullable(),
		in: z.number().array().optional().nullable(),
		notIn: z.number().array().optional().nullable(),
		lt: z.union([z.number(), z.lazy(() => IntFieldRefInputObjectSchema)]).optional(),
		lte: z.union([z.number(), z.lazy(() => IntFieldRefInputObjectSchema)]).optional(),
		gt: z.union([z.number(), z.lazy(() => IntFieldRefInputObjectSchema)]).optional(),
		gte: z.union([z.number(), z.lazy(() => IntFieldRefInputObjectSchema)]).optional(),
		not: z
			.union([z.number(), z.lazy(() => NestedIntNullableFilterObjectSchema)])
			.optional()
			.nullable(),
	})
	.strict();

export const IntNullableFilterObjectSchema = Schema;
