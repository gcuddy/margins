import { z } from 'zod';
import { ContextNodeWhereInputObjectSchema } from './ContextNodeWhereInput.schema';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { UserRelationFilterObjectSchema } from './UserRelationFilter.schema';
import { UserWhereInputObjectSchema } from './UserWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ContextNodeWhereUniqueInput> = z
	.object({
		id: z.string().optional(),
		AND: z
			.union([
				z.lazy(() => ContextNodeWhereInputObjectSchema),
				z.lazy(() => ContextNodeWhereInputObjectSchema).array(),
			])
			.optional(),
		OR: z
			.lazy(() => ContextNodeWhereInputObjectSchema)
			.array()
			.optional(),
		NOT: z
			.union([
				z.lazy(() => ContextNodeWhereInputObjectSchema),
				z.lazy(() => ContextNodeWhereInputObjectSchema).array(),
			])
			.optional(),
		name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
		url: z
			.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()])
			.optional()
			.nullable(),
		description: z
			.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()])
			.optional()
			.nullable(),
		owner: z
			.union([
				z.lazy(() => UserRelationFilterObjectSchema),
				z.lazy(() => UserWhereInputObjectSchema),
			])
			.optional(),
		userId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
		refers_to: z
			.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()])
			.optional()
			.nullable(),
	})
	.strict();

export const ContextNodeWhereUniqueInputObjectSchema = Schema;
