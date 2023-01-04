import { z } from 'zod';
import { UserEntryWhereInputObjectSchema } from './UserEntryWhereInput.schema';
import { StylesheetListRelationFilterObjectSchema } from './StylesheetListRelationFilter.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserEntryWhereUniqueInput> = z
	.object({
		id: z.number().optional(),
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
		Stylesheet: z.lazy(() => StylesheetListRelationFilterObjectSchema).optional(),
	})
	.strict();

export const UserEntryWhereUniqueInputObjectSchema = Schema;
