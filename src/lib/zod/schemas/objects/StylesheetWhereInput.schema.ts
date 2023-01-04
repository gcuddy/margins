import { z } from 'zod';
import { IntFilterObjectSchema } from './IntFilter.schema';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { UserEntryRelationFilterObjectSchema } from './UserEntryRelationFilter.schema';
import { UserEntryWhereInputObjectSchema } from './UserEntryWhereInput.schema';
import { IntNullableFilterObjectSchema } from './IntNullableFilter.schema';
import { UserRelationFilterObjectSchema } from './UserRelationFilter.schema';
import { UserWhereInputObjectSchema } from './UserWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.StylesheetWhereInput> = z
	.object({
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
		id: z.union([z.lazy(() => IntFilterObjectSchema), z.number()]).optional(),
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

export const StylesheetWhereInputObjectSchema = Schema;
