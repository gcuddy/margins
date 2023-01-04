import { z } from 'zod';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { IntNullableFilterObjectSchema } from './IntNullableFilter.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserScalarWhereInput> = z
	.object({
		AND: z
			.union([
				z.lazy(() => UserScalarWhereInputObjectSchema),
				z.lazy(() => UserScalarWhereInputObjectSchema).array(),
			])
			.optional(),
		OR: z
			.lazy(() => UserScalarWhereInputObjectSchema)
			.array()
			.optional(),
		NOT: z
			.union([
				z.lazy(() => UserScalarWhereInputObjectSchema),
				z.lazy(() => UserScalarWhereInputObjectSchema).array(),
			])
			.optional(),
		id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
		provider_id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
		hashed_password: z
			.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()])
			.optional()
			.nullable(),
		createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
		updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
		email: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
		username: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
		default_state_id: z
			.union([z.lazy(() => IntNullableFilterObjectSchema), z.number()])
			.optional()
			.nullable(),
	})
	.strict();

export const UserScalarWhereInputObjectSchema = Schema;
