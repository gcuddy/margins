import { z } from 'zod';
import { StringFieldRefInputObjectSchema } from './StringFieldRefInput.schema';
import { NestedStringFilterObjectSchema } from './NestedStringFilter.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.StringFilter> = z
	.object({
		equals: z.union([z.string(), z.lazy(() => StringFieldRefInputObjectSchema)]).optional(),
		in: z.string().array().optional(),
		notIn: z.string().array().optional(),
		lt: z.union([z.string(), z.lazy(() => StringFieldRefInputObjectSchema)]).optional(),
		lte: z.union([z.string(), z.lazy(() => StringFieldRefInputObjectSchema)]).optional(),
		gt: z.union([z.string(), z.lazy(() => StringFieldRefInputObjectSchema)]).optional(),
		gte: z.union([z.string(), z.lazy(() => StringFieldRefInputObjectSchema)]).optional(),
		contains: z.union([z.string(), z.lazy(() => StringFieldRefInputObjectSchema)]).optional(),
		startsWith: z.union([z.string(), z.lazy(() => StringFieldRefInputObjectSchema)]).optional(),
		endsWith: z.union([z.string(), z.lazy(() => StringFieldRefInputObjectSchema)]).optional(),
		search: z.string().optional(),
		not: z.union([z.string(), z.lazy(() => NestedStringFilterObjectSchema)]).optional(),
	})
	.strict();

export const StringFilterObjectSchema = Schema;
