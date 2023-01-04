import { z } from 'zod';
import { JsonFieldRefInputObjectSchema } from './JsonFieldRefInput.schema';
import { JsonNullValueFilterSchema } from '../enums/JsonNullValueFilter.schema';
import { StringFieldRefInputObjectSchema } from './StringFieldRefInput.schema';

import type { Prisma } from '@prisma/client';

const literalSchema = z.union([z.string(), z.number(), z.boolean()]);
const jsonSchema: z.ZodType<Prisma.InputJsonValue> = z.lazy(() =>
	z.union([literalSchema, z.array(jsonSchema.nullable()), z.record(jsonSchema.nullable())])
);

const Schema: z.ZodType<Prisma.JsonFilter> = z
	.object({
		equals: z
			.union([
				jsonSchema,
				z.lazy(() => JsonFieldRefInputObjectSchema),
				z.lazy(() => JsonNullValueFilterSchema),
			])
			.optional(),
		path: z.string().optional(),
		string_contains: z
			.union([z.string(), z.lazy(() => StringFieldRefInputObjectSchema)])
			.optional(),
		string_starts_with: z
			.union([z.string(), z.lazy(() => StringFieldRefInputObjectSchema)])
			.optional(),
		string_ends_with: z
			.union([z.string(), z.lazy(() => StringFieldRefInputObjectSchema)])
			.optional(),
		array_contains: z
			.union([jsonSchema, z.lazy(() => JsonFieldRefInputObjectSchema)])
			.optional()
			.nullable(),
		array_starts_with: z
			.union([jsonSchema, z.lazy(() => JsonFieldRefInputObjectSchema)])
			.optional()
			.nullable(),
		array_ends_with: z
			.union([jsonSchema, z.lazy(() => JsonFieldRefInputObjectSchema)])
			.optional()
			.nullable(),
		lt: jsonSchema.optional(),
		lte: jsonSchema.optional(),
		gt: jsonSchema.optional(),
		gte: jsonSchema.optional(),
		not: z
			.union([
				jsonSchema,
				z.lazy(() => JsonFieldRefInputObjectSchema),
				z.lazy(() => JsonNullValueFilterSchema),
			])
			.optional(),
	})
	.strict();

export const JsonFilterObjectSchema = Schema;
