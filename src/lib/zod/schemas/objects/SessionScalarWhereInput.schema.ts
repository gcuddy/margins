import { z } from 'zod';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { BigIntFilterObjectSchema } from './BigIntFilter.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.SessionScalarWhereInput> = z
	.object({
		AND: z
			.union([
				z.lazy(() => SessionScalarWhereInputObjectSchema),
				z.lazy(() => SessionScalarWhereInputObjectSchema).array(),
			])
			.optional(),
		OR: z
			.lazy(() => SessionScalarWhereInputObjectSchema)
			.array()
			.optional(),
		NOT: z
			.union([
				z.lazy(() => SessionScalarWhereInputObjectSchema),
				z.lazy(() => SessionScalarWhereInputObjectSchema).array(),
			])
			.optional(),
		id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
		user_id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
		expires: z.union([z.lazy(() => BigIntFilterObjectSchema), z.bigint()]).optional(),
		idle_expires: z.union([z.lazy(() => BigIntFilterObjectSchema), z.bigint()]).optional(),
	})
	.strict();

export const SessionScalarWhereInputObjectSchema = Schema;
