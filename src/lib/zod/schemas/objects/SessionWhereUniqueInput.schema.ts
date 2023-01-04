import { z } from 'zod';
import { SessionWhereInputObjectSchema } from './SessionWhereInput.schema';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { BigIntFilterObjectSchema } from './BigIntFilter.schema';
import { UserRelationFilterObjectSchema } from './UserRelationFilter.schema';
import { UserWhereInputObjectSchema } from './UserWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.SessionWhereUniqueInput> = z
	.object({
		id: z.string().optional(),
		AND: z
			.union([
				z.lazy(() => SessionWhereInputObjectSchema),
				z.lazy(() => SessionWhereInputObjectSchema).array(),
			])
			.optional(),
		OR: z
			.lazy(() => SessionWhereInputObjectSchema)
			.array()
			.optional(),
		NOT: z
			.union([
				z.lazy(() => SessionWhereInputObjectSchema),
				z.lazy(() => SessionWhereInputObjectSchema).array(),
			])
			.optional(),
		user_id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
		expires: z.union([z.lazy(() => BigIntFilterObjectSchema), z.bigint()]).optional(),
		idle_expires: z.union([z.lazy(() => BigIntFilterObjectSchema), z.bigint()]).optional(),
		user: z
			.union([
				z.lazy(() => UserRelationFilterObjectSchema),
				z.lazy(() => UserWhereInputObjectSchema),
			])
			.optional(),
	})
	.strict();

export const SessionWhereUniqueInputObjectSchema = Schema;
