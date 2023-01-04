import { z } from 'zod';
import { StringFieldRefInputObjectSchema } from './StringFieldRefInput.schema';
import { NestedStringWithAggregatesFilterObjectSchema } from './NestedStringWithAggregatesFilter.schema';
import { NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedStringFilterObjectSchema } from './NestedStringFilter.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.StringWithAggregatesFilter> = z
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
		not: z
			.union([z.string(), z.lazy(() => NestedStringWithAggregatesFilterObjectSchema)])
			.optional(),
		_count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
		_min: z.lazy(() => NestedStringFilterObjectSchema).optional(),
		_max: z.lazy(() => NestedStringFilterObjectSchema).optional(),
	})
	.strict();

export const StringWithAggregatesFilterObjectSchema = Schema;
