import { z } from 'zod';
import { StylesheetWhereInputObjectSchema } from './StylesheetWhereInput.schema';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { UserEntryRelationFilterObjectSchema } from './UserEntryRelationFilter.schema';
import { UserEntryWhereInputObjectSchema } from './UserEntryWhereInput.schema';
import { IntNullableFilterObjectSchema } from './IntNullableFilter.schema';
import { UserRelationFilterObjectSchema } from './UserRelationFilter.schema';
import { UserWhereInputObjectSchema } from './UserWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.StylesheetWhereUniqueInput> = z
	.object({
		id: z.number().optional(),
		AND: z
			.union([
				z.lazy(() => StylesheetWhereInputObjectSchema),
				z.lazy(() => StylesheetWhereInputObjectSchema).array(),
			])
			.optional(),
		OR: z
			.lazy(() => StylesheetWhereInputObjectSchema)
			.array()
			.optional(),
		NOT: z
			.union([
				z.lazy(() => StylesheetWhereInputObjectSchema),
				z.lazy(() => StylesheetWhereInputObjectSchema).array(),
			])
			.optional(),
		domain: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
		css: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
		entry: z
			.union([
				z.lazy(() => UserEntryRelationFilterObjectSchema),
				z.lazy(() => UserEntryWhereInputObjectSchema),
			])
			.optional()
			.nullable(),
		userEntryId: z
			.union([z.lazy(() => IntNullableFilterObjectSchema), z.number()])
			.optional()
			.nullable(),
		user: z
			.union([
				z.lazy(() => UserRelationFilterObjectSchema),
				z.lazy(() => UserWhereInputObjectSchema),
			])
			.optional(),
		userId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
	})
	.strict();

export const StylesheetWhereUniqueInputObjectSchema = Schema;
