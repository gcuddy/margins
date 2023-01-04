import { z } from 'zod';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema } from './StringNullableFilter.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ContextNodeScalarWhereInput> = z
	.object({
		AND: z
			.union([
				z.lazy(() => ContextNodeScalarWhereInputObjectSchema),
				z.lazy(() => ContextNodeScalarWhereInputObjectSchema).array(),
			])
			.optional(),
		OR: z
			.lazy(() => ContextNodeScalarWhereInputObjectSchema)
			.array()
			.optional(),
		NOT: z
			.union([
				z.lazy(() => ContextNodeScalarWhereInputObjectSchema),
				z.lazy(() => ContextNodeScalarWhereInputObjectSchema).array(),
			])
			.optional(),
		id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
		name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
		url: z
			.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()])
			.optional()
			.nullable(),
		description: z
			.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()])
			.optional()
			.nullable(),
		userId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
		refers_to: z
			.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()])
			.optional()
			.nullable(),
	})
	.strict();

export const ContextNodeScalarWhereInputObjectSchema = Schema;
