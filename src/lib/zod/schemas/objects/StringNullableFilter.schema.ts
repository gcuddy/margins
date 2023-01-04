import { z } from 'zod';
import { StringFieldRefInputObjectSchema } from './StringFieldRefInput.schema';
import { NestedStringNullableFilterObjectSchema } from './NestedStringNullableFilter.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.StringNullableFilter> = z
	.object({
		equals: z
			.union([z.string(), z.lazy(() => StringFieldRefInputObjectSchema)])
			.optional()
			.nullable(),
		in: z.string().array().optional().nullable(),
		notIn: z.string().array().optional().nullable(),
		lt: z.union([z.string(), z.lazy(() => StringFieldRefInputObjectSchema)]).optional(),
		lte: z.union([z.string(), z.lazy(() => StringFieldRefInputObjectSchema)]).optional(),
		gt: z.union([z.string(), z.lazy(() => StringFieldRefInputObjectSchema)]).optional(),
		gte: z.union([z.string(), z.lazy(() => StringFieldRefInputObjectSchema)]).optional(),
		contains: z.union([z.string(), z.lazy(() => StringFieldRefInputObjectSchema)]).optional(),
		startsWith: z.union([z.string(), z.lazy(() => StringFieldRefInputObjectSchema)]).optional(),
		endsWith: z.union([z.string(), z.lazy(() => StringFieldRefInputObjectSchema)]).optional(),
		search: z.string().optional(),
		not: z
			.union([z.string(), z.lazy(() => NestedStringNullableFilterObjectSchema)])
			.optional()
			.nullable(),
	})
	.strict();

export const StringNullableFilterObjectSchema = Schema;
