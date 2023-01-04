import { z } from 'zod';
import { IntFilterObjectSchema } from './IntFilter.schema';
import { StylesheetListRelationFilterObjectSchema } from './StylesheetListRelationFilter.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserEntryWhereInput> = z
	.object({
		AND: z
			.union([
				z.lazy(() => UserEntryWhereInputObjectSchema),
				z.lazy(() => UserEntryWhereInputObjectSchema).array(),
			])
			.optional(),
		OR: z
			.lazy(() => UserEntryWhereInputObjectSchema)
			.array()
			.optional(),
		NOT: z
			.union([
				z.lazy(() => UserEntryWhereInputObjectSchema),
				z.lazy(() => UserEntryWhereInputObjectSchema).array(),
			])
			.optional(),
		id: z.union([z.lazy(() => IntFilterObjectSchema), z.number()]).optional(),
		Stylesheet: z.lazy(() => StylesheetListRelationFilterObjectSchema).optional(),
	})
	.strict();

export const UserEntryWhereInputObjectSchema = Schema;
