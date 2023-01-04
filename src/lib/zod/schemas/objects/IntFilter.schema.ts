import { z } from 'zod';
import { IntFieldRefInputObjectSchema } from './IntFieldRefInput.schema';
import { NestedIntFilterObjectSchema } from './NestedIntFilter.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.IntFilter> = z
	.object({
		equals: z.union([z.number(), z.lazy(() => IntFieldRefInputObjectSchema)]).optional(),
		in: z.number().array().optional(),
		notIn: z.number().array().optional(),
		lt: z.union([z.number(), z.lazy(() => IntFieldRefInputObjectSchema)]).optional(),
		lte: z.union([z.number(), z.lazy(() => IntFieldRefInputObjectSchema)]).optional(),
		gt: z.union([z.number(), z.lazy(() => IntFieldRefInputObjectSchema)]).optional(),
		gte: z.union([z.number(), z.lazy(() => IntFieldRefInputObjectSchema)]).optional(),
		not: z.union([z.number(), z.lazy(() => NestedIntFilterObjectSchema)]).optional(),
	})
	.strict();

export const IntFilterObjectSchema = Schema;
